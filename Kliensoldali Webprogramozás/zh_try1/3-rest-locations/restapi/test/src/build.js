// Utility
const path = require("path");
const { promisify } = require("util");
const _ = require("lodash");
const Obfuscator = require("javascript-obfuscator");
const fs = require("fs");
const lzString = require("lz-string");
const commander = require("commander");
const chalk = require("chalk");

// Webpack + pluginok
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

// Sequelize
const { getModels, getMigrations } = require("./sequelize-paths");

// Commander
const program = new commander.Command();

program.option("--no-encrypt", "Ne titkosítsa a fájlokat, csak simán fűzze őket össze");
program.parse();

const options = program.opts();

const obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.5,
    debugProtection: false,
    identifierNamesGenerator: "hexadecimal",
    numbersToExpressions: true,
    renameGlobals: true,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 16,
    stringArray: true,
    stringArrayEncoding: ["rc4", "base64"],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    stringArrayWrappersType: "function",
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    target: "node",
};

// [require(...),require(...)] szintű lisák előállítása a Sequelize-hoz
const sequelizeModelRequires = () => {
    const models = getModels().map((file) => `require("${file}")`);
    return `[${models.join(",")}];`;
};

const sequelizeMigrationRequires = () => {
    const migrations = getMigrations().map((file) => `require("${file}")`);
    return `[${migrations.join(",")}];`;
};

compileTester = async () => {
    let webpackConfig = {
        mode: "production",
        target: "node",
        entry: path.join(__dirname + "/tester.js"),
        externalsPresets: { node: true },
        externals: [
            nodeExternals({
                // A kezdőcsomag node_modules mappáját is ki kell zárni, mert abból is húzunk be fájlokat a webpackkel a build során
                // Tehát ez nem a jelen src mappa node_modules része!
                additionalModuleDirs: ["../../node_modules"],
            }),
        ],
        optimization: {
            // Ne legyen minify, mert elronthatja a Babeles transzformációkat
            minimize: false,
        },
        module: {
            rules: [
                // Szükséges a Sequelize kódok explicit importálása, hogy a statikus analízis felismerje őket utána
                // Ennek érdekében sima string replace-t használunk
                {
                    test: /sequelize\.js$/,
                    enforce: "pre",
                    loader: "string-replace-loader",
                    options: {
                        multiple: [
                            // Feleslegessé vált dolgok törlése a kódból
                            {
                                search: 'const { getModels, getMigrations } = require("./sequelize-paths");',
                                replace: "",
                            },
                            {
                                search: "requireSequelizeModels = () => getModels().map((model) => require(model));",
                                replace: "",
                            },
                            {
                                search: "requireSequelizeMigrations = () => getMigrations().map((migration) => require(migration));",
                                replace: "",
                            },
                            // Explicit listák beszúrása a require-hoz
                            {
                                search: "requireSequelizeModels();",
                                replace: sequelizeModelRequires(),
                            },
                            {
                                search: "requireSequelizeMigrations();",
                                replace: sequelizeMigrationRequires(),
                            },
                        ],
                    },
                },
                {
                    test: /sequelize-paths\.js$/,
                    enforce: "pre",
                    loader: "string-replace-loader",
                    options: {
                        multiple: [
                            {
                                search: "const production = false;",
                                replace: "const production = true;",
                            },
                        ],
                    },
                },
            ],
        },
        resolveLoader: {
            alias: {
                // "object-transform-loader": path.resolve(__dirname, "build-tools/object-transform-loader.js"),
                "babel-transforms": path.resolve(__dirname, "build-tools/babel-transforms.js"),
            },
        },
        plugins: [],
        output: {
            path: path.join(__dirname),
            filename: "../tester.js",
        },
    };

    if (options.encrypt === true) {
        // webpackConfig.module.rules.push({
        //     test: /\.js$/,
        //     use: ["object-transform-loader"],
        // });
        // webpackConfig.module.rules.push({
        //     enforce: "post",
        //     test: /\.js$/,
        //     use: ["babel-transforms"],
        // });
        webpackConfig.plugins.push(new WebpackObfuscator(obfuscatorConfig));
    }

    const compiler = webpack(webpackConfig);
    const asyncCompiler = promisify(compiler.run, { context: compiler });
    return await asyncCompiler.call(compiler);
};

// Fájl wrapperelése egy plusz réteg védelemmel + tömörítés
wrapperFile = (input, output = null) => {
    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function splitStringToRandomChunks(input, min, max) {
        let arr = [];
        let start = 0;
        while (start < input.length) {
            let rand = randomBetween(min, max);
            arr.push(input.substring(start, start + rand));
            start += rand;
        }
        return arr;
    }

    function shuffleArrayWithKey(arr, key) {
        let movingKey = key;
        while (movingKey != 1) {
            if (movingKey % 2 == 1) {
                movingKey = movingKey * 3 + 1;
            } else {
                movingKey = movingKey / 2;
            }
            if (movingKey % 2 == 1) {
                let b = arr[1];
                arr[1] = arr[movingKey % arr.length];
                arr[movingKey % arr.length] = b;
            } else {
                let b = arr[0];
                arr[0] = arr[movingKey % arr.length];
                arr[movingKey % arr.length] = b;
            }
        }
        return arr;
    }

    const testerObfuscated = fs.readFileSync(path.join(__dirname, input)).toString();
    const testerObfuscatedCompressed = lzString.compressToEncodedURIComponent(testerObfuscated);

    const key = Math.floor(Math.random() * 100) + 25;
    const arr = shuffleArrayWithKey(splitStringToRandomChunks(testerObfuscatedCompressed, 6, 18), key);

    let chunkArray = Obfuscator.obfuscate(`let chunkArray = ${JSON.stringify(arr)};`, {
        renameGlobals: true,
        identifierNamesCache: {},
        stringArray: false,
    });

    wrapper =
        chunkArray.getObfuscatedCode() +
        Obfuscator.obfuscate(
            `// Illetéktelen eval módosítások (pl eval -> console.log)
            if (new Function("return eval").call().toString() === "function eval() { [native code] }") {
                // Dekóder tömb felépítése a kulcs alapján
                let decoderArray = [];
                let movingKey = ${key};
                while (movingKey != 1) {
                    if (movingKey % 2 == 1) {
                        movingKey = movingKey * 3 + 1;
                    } else {
                        movingKey = movingKey / 2;
                    }
                    decoderArray.push(movingKey);
                }
                // Belső végrehajtás
                ;(new Function('require', '__dirname', 'arr', 'nums', \`${Obfuscator.obfuscate(
                    `const lzString = require("lz-string");
                    for (let i = nums.length - 1; i >= 0; i--) {
                        if (nums[i] % 2 == 1) {
                            let b = arr[1];
                            arr[1] = arr[nums[i] % arr.length];
                            arr[nums[i] % arr.length] = b;
                        } else {
                            let b = arr[0];
                            arr[0] = arr[nums[i] % arr.length];
                            arr[nums[i] % arr.length] = b;
                        }
                    }
                    return eval(
                        lzString.decompressFromEncodedURIComponent(arr.join(""))
                    );`,
                    _.merge({}, obfuscatorConfig, {
                        selfDefending: false, // hibát okoz és ezen a ponton még felesleges
                    })
                ).getObfuscatedCode()}\`)).call(this, require, __dirname, chunkArray, decoderArray);
            }`,
            _.merge({}, obfuscatorConfig, {
                identifierNamesCache: chunkArray.getIdentifierNamesCache(),
            })
        ).getObfuscatedCode();

    fs.writeFileSync(path.join(__dirname, output ? output : input), wrapper);
};

(async () => {
    console.log("1. Webpack futtatása:");
    console.log(chalk.gray("---------------------"));
    const stats = await compileTester();
    console.log(
        stats
            .toString({
                errorDetails: true,
                warnings: true,
                colors: true,
            })
            .replaceAll(/^/gm, "  ")
    );
    if (stats.hasErrors() || stats.hasWarnings()) {
        throw new Error(
            stats.toString({
                errorDetails: true,
                warnings: true,
            })
        );
    }
    if (options.encrypt === true) {
        console.log("  [" + chalk.green("OK") + "] Tesztelő összefűzve, transzformálva, obfuszkálva!");
    } else {
        console.log("  [" + chalk.yellow("OK") + "] Tesztelő összefűzve, nincs titkosítás");
    }
    console.log(" ");

    // -----------------------

    console.log("2. Tesztelő wrapperelése:");
    console.log(chalk.gray("-------------------------"));
    if (options.encrypt === true) {
        wrapperFile("../tester.js");
        console.log("  [" + chalk.green("OK") + "] Tesztelő wrapperelve");
    } else {
        console.log("  [" + chalk.yellow("KIHAGYVA") + "] Nincs titkosítás");
    }

    console.log(" ");

    // -----------------------

    console.log("3. Inject obfuszkálása:");
    console.log(chalk.gray("-----------------------"));
    const injectContent = fs.readFileSync(path.join(__dirname, "./inject.js")).toString();
    if (options.encrypt === true) {
        // Inject obfuszkálása
        const injectObfuscated = Obfuscator.obfuscate(injectContent, obfuscatorConfig);
        fs.writeFileSync(path.join(__dirname, "../inject.js"), injectObfuscated.getObfuscatedCode());
        console.log("  [" + chalk.green("OK") + "] Inject obfuszkálva");
    } else {
        fs.writeFileSync(path.join(__dirname, "../inject.js"), injectContent);
        console.log("  [" + chalk.yellow("KIHAGYVA") + "] Nincs titkosítás");
    }
})();
