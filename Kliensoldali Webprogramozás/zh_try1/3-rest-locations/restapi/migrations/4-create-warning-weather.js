"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("WarningWeather", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            WarningId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "warnings",
                    key: "id",
                },
                onDelete: "cascade",
            },
            WeatherId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "weather",
                    key: "id",
                },
                onDelete: "cascade",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
        await queryInterface.addConstraint("WarningWeather", {
            fields: ["WarningId", "WeatherId"],
            type: "unique",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("WarningWeather");
    },
};
