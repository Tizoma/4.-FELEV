const { readdirSync } = require("fs");
const path = require("path");

// Production build egyel feljebbi szinten van
const production = false;

module.exports = {
    getModels: () =>
        readdirSync(path.join(__dirname + (production ? "/../models" : "/../../models")))
            .filter((file) => file !== "index.js" && path.extname(file) === ".js")
            .map((file) => (production ? "../models/" + file : "../../models/" + file)),

    getMigrations: () =>
        readdirSync(path.join(__dirname + (production ? "/../migrations" : "/../../migrations")))
            .filter((file) => /[0-9]+\-[-\w^&'@{}[\],$=!#().%+~]+\.js/.test(file))
            .sort((first, second) => {
                const firstTimestamp = parseInt(first.split("-")[0]);
                const secondTimestamp = parseInt(second.split("-")[0]);
                if (firstTimestamp < secondTimestamp) return -1;
                else if (firstTimestamp > secondTimestamp) return 1;
                return 0;
            })
            .map((file) => (production ? "../migrations/" + file : "../../migrations/" + file)),

    getSeeders: () =>
        readdirSync(path.join(__dirname + (production ? "/../seeders" : "/../../seeders")))
            .filter((file) => /[0-9]+\-[-\w^&'@{}[\],$=!#().%+~]+\.js/.test(file))
            .sort((first, second) => {
                const firstTimestamp = parseInt(first.split("-")[0]);
                const secondTimestamp = parseInt(second.split("-")[0]);
                if (firstTimestamp < secondTimestamp) return -1;
                else if (firstTimestamp > secondTimestamp) return 1;
                return 0;
            })
            .map((file) => (production ? "../seeders/" + file : "../../seeders/" + file)),
};
