const db = require("../models");
const { Sequelize, sequelize } = db;
const { ValidationError, DatabaseError, Op } = Sequelize;
const { Location, Warning, Weather } = db;

module.exports = {
    Query: {
        locations: async () => await Location.findAll(),
        weather: async () => await Weather.findAll(),
        location: async(_, { id }) => await Location.findByPk(id),
        statistics: async () => {
            return {
                locationCount: await Location.count(),
                averageTemp: (await Weather.findAll()).reduce((s, w) => w.temp + s, 0) / (await Weather.count()),
                over30Celsius: await Weather.count( { where: { temp: { [Op.gt]: 30 } } }),
                multipleWarnings: (await Weather.findAll( { include: Warning } )).filter(w => w.Warnings.length >= 2).length,
                mostActiveLocation: (await Location.findAll( { include: Weather, order: [['id', 'ASC']] })).reduce((r, l) => l.Weather.length > r.Weather.length ? l : r, { Weather: []} )
            }
        }
    },
    Mutation: {
        createWeather: async (_, { input }) => await Weather.create(input),
        setPublic: async(_, { LocationId, public }) => {
            const l = await Location.findByPk(LocationId)
            if (!l) return "NOT FOUND";
            if (l.public === public) return "ALREADY SET";
            await l.update({ public });
            return "CHANGED";
        }
    },
    Weather: {
        location: async (we) => await we.getLocation(),
        warnings: async (we) => await we.getWarnings( { order: [['level', 'DESC']]} )
    },
    Location: {
        currentTemp: async (l) => (await Weather.findOne( { where: { LocationId: l.id }, order: [['loggedAt', 'DESC']] } ))?.temp
    }
};
