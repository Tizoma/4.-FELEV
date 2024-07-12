// Build2 - modellekhez, migrationokhoz, seederekhez

// Utility
const path = require("path");
const { promisify } = require("util");
const _ = require("lodash");
const Obfuscator = require("javascript-obfuscator");
const chalk = require("chalk");
const fs = require("fs").promises;
const transformObjects = require("./build-tools/object-transform-loader.js");
const babel = require("@babel/core");

function babelTransforms(source) {
    return babel.transformSync(source, {
        plugins: [
            // Objektum destrukturálások átalakítása, pl let { a, b } = { a: 1, b: 2, c: 3 }
            "@babel/plugin-transform-destructuring",
            // Paraméterekben lévő objektum destrukturálások átalakítása
            "@babel/plugin-transform-parameters",
            // Arrow function-ok sima function-okká alakítása
            "@babel/plugin-transform-arrow-functions",
        ],
    }).code;
}

const obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.4,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    identifierNamesGenerator: "hexadecimal",
    numbersToExpressions: true,
    renameGlobals: true,
    selfDefending: false,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 16,
    stringArray: true,
    stringArrayEncoding: ["rc4"],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 3,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 3,
    stringArrayWrappersType: "function",
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    target: "node",
};

(async () => {
    try {
        await fs.mkdir(__dirname + "/../hallgatoknak");
    } catch (e) {}

    // Modellek
    const models = (await fs.readdir(path.join(__dirname + "/../../models"))).filter((file) => file !== "index.js" && path.extname(file) === ".js").map((file) => "../../models/" + file);

    try {
        await fs.mkdir(__dirname + "/../hallgatoknak/models");
    } catch (e) {}

    // index.js
    await fs.writeFile("../hallgatoknak/models/index.js", await fs.readFile("../../models/index.js"));

    // models
    for (const model of models) {
        const base = path.parse(model).base;
        //console.log(model, path.join("../hallgatoknak/models", base));
        const code = transformObjects((await fs.readFile(path.join(__dirname, model))).toString());
        await fs.writeFile(path.join("../hallgatoknak/models", base), Obfuscator.obfuscate(babelTransforms(code), obfuscatorConfig).getObfuscatedCode());
    }

    // Migrációk
    const migrations = (await fs.readdir(path.join(__dirname + "/../../migrations")))
        .filter((file) => /[0-9]+\-[-\w^&'@{}[\],$=!#().%+~]+\.js/.test(file))
        .sort((first, second) => {
            const firstTimestamp = parseInt(first.split("-")[0]);
            const secondTimestamp = parseInt(second.split("-")[0]);
            if (firstTimestamp < secondTimestamp) return -1;
            else if (firstTimestamp > secondTimestamp) return 1;
            return 0;
        })
        .map((file) => "../../migrations/" + file);

    try {
        await fs.mkdir(__dirname + "/../hallgatoknak/migrations");
    } catch (e) {}

    for (const migration of migrations) {
        const base = path.parse(migration).base;
        const code = transformObjects((await fs.readFile(path.join(__dirname, migration))).toString());
        await fs.writeFile(path.join("../hallgatoknak/migrations", base), Obfuscator.obfuscate(babelTransforms(code), obfuscatorConfig).getObfuscatedCode());
    }

    // Seederek
    const seeders = (await fs.readdir(__dirname + "/../../seeders"))
        .filter((file) => /[0-9]+\-[-\w^&'@{}[\],$=!#().%+~]+\.js/.test(file))
        .sort((first, second) => {
            const firstTimestamp = parseInt(first.split("-")[0]);
            const secondTimestamp = parseInt(second.split("-")[0]);
            if (firstTimestamp < secondTimestamp) return -1;
            else if (firstTimestamp > secondTimestamp) return 1;
            return 0;
        })
        .map((file) => "../../seeders/" + file);

    try {
        await fs.mkdir(__dirname + "/../hallgatoknak/seeders");
    } catch (e) {}

    for (const seeder of seeders) {
        const base = path.parse(seeder).base;
        const code = transformObjects((await fs.readFile(path.join(__dirname, seeder))).toString());
        await fs.writeFile(path.join("../hallgatoknak/seeders", base), Obfuscator.obfuscate(babelTransforms(code), obfuscatorConfig).getObfuscatedCode());
    }
})();
