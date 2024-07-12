"use strict";

// Faker dokumentáció, API referencia: https://fakerjs.dev/guide/#node-js
const { faker } = require("@faker-js/faker");
const chalk = require("chalk");
const { Location, Warning, Weather } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const locationCount = 10 + Math.floor(Math.random() * 10)
        const locationNames = faker.helpers.uniqueArray(faker.location.city, locationCount)
        const locations = []
        for (let i = 0; i < locationCount; i++){
            locations.push(await Location.create({
                name: locationNames[i],
                lat: faker.number.float({ min: -90, max: 90 }),
                lon: faker.number.float({ min: -180, max: 180 }),
                public: Math.random() < 0.7
            }))
        }
        const warningCount = 5 + Math.floor(Math.random() * 5)
        const warnings = []
        for (let i = 0; i < warningCount; i++){
            warnings.push(await Warning.create({
                level: 1 + Math.floor(Math.random() * 5),
                message: Math.random() < 0.5 ? faker.lorem.paragraph() : null
            }))
        }
        const weatherCount = 50 + Math.floor(Math.random() * 50)
        for (let i = 0; i < weatherCount; i++){
            const w = await Weather.create({
                type: faker.helpers.arrayElement(['sunny', 'rain', 'cloudy', 'thunder', 'other']),
                LocationId: faker.helpers.arrayElement(locations).id,
                temp: faker.number.float({ min: -20, max: 40 }),
                loggedAt: faker.date.past({ years: 5 })
            })
            await w.setWarnings(faker.helpers.arrayElements(warnings))
        }

        console.log(chalk.green("A DatabaseSeeder lefutott"));
    },

    // Erre alapvetően nincs szükséged, mivel a parancsok úgy vannak felépítve,
    // hogy tiszta adatbázist generálnak, vagyis a korábbi adatok enélkül is elvesznek
    down: async (queryInterface, Sequelize) => {},
};
