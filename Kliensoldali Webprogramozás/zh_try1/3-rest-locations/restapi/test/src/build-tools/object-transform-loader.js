/*
    Transform objects
    David Tota

    It can be used as Webpack loader with the following config:

    rules: [
        {
            // apply to all js files
            test: /\.js$/,
            use: ["transform-objects-loader"],
        },
        ...
    ],
    resolveLoader: {
        alias: {
            "transform-objects-loader": path.resolve(__dirname, "transform-objects.js"),
        },
    },
*/

// Babel
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const template = require("@babel/template").default;
const types = require("@babel/types");

function transformObjects(source) {
    const ast = parser.parse(source);

    let objSeq = 0;
    let spreadObjSeq = 0;

    const buildFn = template(`
        (() => {
            let %%objectName%% = {};
            %%assignProperties%%
            return %%objectName%%;
        })()
    `);

    const buildLoop = template(`
        for (let [key, value] of Object.entries(%%spreadedObjectName%%)) {
            %%objectName%%[key] = value;
        }
    `);

    const buildLoopEx = template(`
        (() => {
            let %%spreadedObjectName%% = %%spreadedObject%%;
            for (let [key, value] of Object.entries(%%spreadedObjectName%%)) {
                %%objectName%%[key] = value;
            }
        })()
    `);

    traverse(ast, {
        enter(path) {
            if (path.isObjectExpression()) {
                // skip empty objects: {}
                if (path.node.properties.length) {
                    objSeq++;
                    // Replace object with the builder fn
                    path.replaceWith(
                        buildFn({
                            objectName: types.identifier(`_objectToMake${objSeq}`), // builded object id
                            assignProperties: path.node.properties.map((prop) => {
                                // handle regular properties
                                if (types.isProperty(prop)) {
                                    return types.expressionStatement(
                                        types.assignmentExpression(
                                            "=",
                                            types.memberExpression(
                                                types.identifier(`_objectToMake${objSeq}`), // object id
                                                prop.key, // object member
                                                prop.key.type !== "Identifier" // computed?
                                            ),
                                            prop.value
                                        )
                                    );
                                }
                                // handle methods
                                else if (types.isMethod(prop)) {
                                    return types.expressionStatement(
                                        types.assignmentExpression(
                                            "=",
                                            types.memberExpression(
                                                types.identifier(`_objectToMake${objSeq}`), // object id
                                                prop.key, // object member
                                                prop.key.type !== "Identifier" // computed?
                                            ),
                                            types.functionExpression(null, prop.params, prop.body, prop.generator, prop.async)
                                        )
                                    );
                                }
                                // handle spreaded elements
                                else if (types.isSpreadElement(prop)) {
                                    // ...{ something: value } (object "directly" given)
                                    if (types.isObjectExpression(prop.argument)) {
                                        spreadObjSeq++;
                                        return buildLoopEx({
                                            objectName: types.identifier(`_objectToMake${objSeq}`),
                                            spreadedObjectName: types.identifier(`_spreadedObjectToMake${spreadObjSeq}`),
                                            spreadedObject: prop.argument,
                                        });
                                    }
                                    // ...identifier (object "indirectly" spreaded, only id given)
                                    if (types.isIdentifier(prop.argument)) {
                                        return buildLoop({
                                            objectName: types.identifier(`_objectToMake${objSeq}`),
                                            spreadedObjectName: prop.argument.name,
                                        });
                                    }
                                }
                            }),
                        })
                    );
                }
            }
        },
    });

    return generate(ast).code;
}

module.exports = transformObjects;
