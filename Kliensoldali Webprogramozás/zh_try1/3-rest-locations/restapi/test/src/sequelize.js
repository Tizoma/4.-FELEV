// Sequelize integrálása a tesztelőbe

const { Sequelize } = require("sequelize");
const { getModels, getMigrations } = require("./sequelize-paths");

requireSequelizeModels = () => getModels().map((model) => require(model));
requireSequelizeMigrations = () => getMigrations().map((migration) => require(migration));

/**
 * Ennek segítségével tudjuk egyszerűen a mintamegoldásban lévő Sequelize-t integrálni a tesztelőbe.
 * @constructor
 * @param {Object} [sequelizeConfig=null] - Sequelize beállításai, ez opcionális, van alapértelmezett konfiguráció
 * @return {Object}
 */
sequelizeInit = (sequelizeConfig = null) => {
    let db = {};

    // Inicializáció
    // ----------------------------------------
    db.sequelize = new Sequelize(
        sequelizeConfig || {
            // Teszt környezet beállításai
            dialect: "sqlite",
            storage: "database/tester_database.sqlite",
            // A Sequelize ne logolja a konzolra, hogy milyen query-k futottak le
            logging: false,
        }
    );

    // Modellek
    // ----------------------------------------
    let models = requireSequelizeModels();
    db.models = {};

    // Modellek inicializálása
    for (const modelInitializer of models) {
        const model = modelInitializer(db.sequelize, Sequelize.DataTypes);
        db.models[model.name] = model;
    }

    // Miután a db-be összegyűjtöttük a modelleket, az esetleges relációkat (asszociációkat) is meg kell csinálni
    for (const model of Object.keys(db.models)) {
        if (db.models[model].associate) {
            db.models[model].associate(db.models);
        }
    }

    // Migrationok
    // ----------------------------------------
    db.migrations = requireSequelizeMigrations();

    // Migrate metódus, ami először down-t, majd up-ot hív minden migrationre
    db.migrate = async () => {
        const queryInterface = db.sequelize.getQueryInterface();
        for (const migration of db.migrations) {
            await migration.down(queryInterface, Sequelize);
            await migration.up(queryInterface, Sequelize);
        }
    };

    // Legvégül a DB visszaadása
    return db;
};

module.exports = sequelizeInit;
