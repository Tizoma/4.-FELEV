const { StatusCodes } = require("http-status-codes");
const S = require("fluent-json-schema");
const db = require("../models");
const { Sequelize, sequelize } = db;
const { ValidationError, DatabaseError, Op } = Sequelize;
// TODO: Importáld a modelleket
const { Location, Warning, Weather } = db;

module.exports = function (fastify, opts, next) {
    // http://127.0.0.1:4000/
    fastify.get("/locations", async (request, reply) => {
        reply.send(await Location.findAll());
    });

    fastify.get("/locations/:id", async (request, reply) => {
        const id = request.params.id;
        if (isNaN(parseInt(id)) || parseInt(id) !== parseFloat(id)) return reply.status(400).send();
        const loc = await Location.findByPk(id);
        if (!loc) return reply.status(404).send();
        reply.status(200).send(loc);
    });

    fastify.post(
        "/locations",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["name", "lat", "lon"],
                    properties: {
                        name: { type: "string" },
                        lat: { type: "number" },
                        lon: { type: "number" },
                        public: { type: "boolean", default: true },
                    },
                },
            },
        },
        async (request, reply) => {
            const loc = await Location.create(request.body);
            reply.status(201).send(loc);
        }
    );

    fastify.delete("/locations/:id", async (request, reply) => {
        const id = request.params.id;
        if (isNaN(parseInt(id)) || parseInt(id) !== parseFloat(id)) return reply.status(400).send();
        const loc = await Location.findByPk(id);
        if (!loc) return reply.status(404).send();
        else {
            await loc.destroy();
            reply.status(200).send("DELETED");
        }
    });

    fastify.post(
        "/login",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["email"],
                    properties: { email: { type: "string" } },
                },
            },
        },
        async (request, reply) => {
            const re = /^location([0-9]+)@weather\.org$/;
            const res = request.body.email.match(re);
            if (!res) return reply.status(418).send();
            else {
                const id = res[1];
                const loc = await Location.findByPk(id);
                if (!loc) return reply.status(404).send();
                reply.send({ token: fastify.jwt.sign(loc.toJSON()) });
            }
        }
    );

    fastify.get("/local-weather-log", { onRequest: [fastify.auth] }, async (request, reply) => {
        reply.send(await Weather.findAll({ where: { LocationId: request.user.id }, order: [["loggedAt", "ASC"]] }));
    });

    fastify.post(
        "/insert-many",
        {
            onRequest: [fastify.auth],
            schema: {
                body: {
                    type: "object",
                    required: ["type", "startTime", "interval", "temps"],
                    properties: {
                        type: { type: "string" },
                        startTime: { type: "string", format: "date-time" },
                        interval: { type: "integer" },
                        temps: { type: "array", items: { type: "number" } },
                    },
                },
            },
        },
        async (request, reply) => {
            const result = [];
            for (const temp of request.body.temps) {
                result.push(
                    await Weather.create({
                        type: request.body.type,
                        loggedAt: new Date(
                            new Date(request.body.startTime).getTime() + request.body.interval * result.length * 60000
                        ),
                        temp,
                        LocationId: request.user.id,
                    })
                );
            }
            reply.send(result);
        }
    );

    fastify.post(
        "/issue-warning",
        {
            onRequest: [fastify.auth],
            schema: {
                body: {
                    type: "object",
                    required: ["WeatherId", "WarningId"],
                    properties: {
                        WeatherId: { type: "integer" },
                        WarningId: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const we = await Weather.findByPk(request.body.WeatherId);
            const wa = await Warning.findByPk(request.body.WarningId);
            if (!we) return reply.status(404).send("Invalid WeatherId");
            if (we.LocationId !== request.user.id) return reply.status(403).send("Forbidden");
            if (!wa) return reply.status(404).send("Invalid WarningId");
            if (await we.hasWarning(wa)) return reply.status(409).send("Already issued");
            await we.addWarning(wa);
            return reply.status(201).send("Warning issued");
        }
    );

    next();
};

module.exports.autoPrefix = "/";
