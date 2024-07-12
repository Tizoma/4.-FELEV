// Babel
const babel = require("@babel/core");

function babelTransforms(source) {
    return babel.transformSync(source, {
        plugins: [
            // Template literálok átalakítása, pl. gql`valami`, mert ezt az obfuszkátor nem kezeli jól
            "@babel/plugin-transform-template-literals",
            // Objektum destrukturálások átalakítása, pl let { a, b } = { a: 1, b: 2, c: 3 }
            "@babel/plugin-transform-destructuring",
            // Paraméterekben lévő objektum destrukturálások átalakítása
            "@babel/plugin-transform-parameters",
            // Arrow function-ok sima function-okká alakítása
            "@babel/plugin-transform-arrow-functions",
            // Class-ok átalakítása function-okká
            "@babel/plugin-transform-classes",
        ],
    }).code;
}

module.exports = babelTransforms;
