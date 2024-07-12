const { tasks, tester, plugins, plugin, url, timeout, points, title, id, required, task, beforeAll, init, hooks, subtasks, requires, subtask, category } = require("./tester/generator"); // prettier-ignore

// Pluginok
const { GraphQLClient, gql } = require("graphql-request");
const CategorizedConsoleReporter = require("./tester/plugins/categorized.console.reporter");
const TestServer = require("./tester/plugins/testserver");
// const PercentageWarningPlugin = require("./tester/plugins/percentagewarning");

// Helpers
const { lodash: _, chalk, faker, axios, toJSON } = require("./tester/helpers");
const jwt = require("fast-jwt");
jwt.verify = jwt.createVerifier({ key: "secret", algorithm: "HS256" });
jwt.sign = jwt.createSigner({ key: "secret", algorithm: "HS256", expiresIn: 10000 });

// Chai
const chai = require("chai");
chai.use(require("chai-subset"));
chai.use(require("chai-as-promised"));
const expect = chai.expect;

// Sequelize integrálása
const { Op } = require("sequelize");
const SequelizeInject = require("./sequelize")();
const { sequelize, migrate, models: SequelizeInjectModels } = SequelizeInject;
const { Location, Warning, Weather } = SequelizeInjectModels;

const randomSequelizeEntityAsJson = async (model, options = {}) =>
    toJSON(
        await model["findOne"]({
            order: sequelize.random(),
            ...options,
        })
    );

const randomSequelizeEntity = async (model, options = {}) =>
    await model["findOne"]({
        order: sequelize.random(),
        ...options,
    });

const expectAxiosStatus = async (axiosCall, statusCode) => {
    await expect(axiosCall)
        .to.be.eventually.rejectedWith(Error)
        .then((error) => {
            expect(error, "Nem keletkezett Axios hiba").to.have.property("isAxiosError", true);
            expect(error, "A kapott állapotkód nem megfelelő").to.have.nested.property("response.status").that.equals(statusCode);
        });
};

const { Sequelize } = require("sequelize");
// A webpack lecseréli a require hívásokat, de itt szükségünk van az eredeti require hívás kikényszerítésére
const forceRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
const { getModels, getMigrations, getSeeders } = require("./sequelize-paths");
const { StatusCodes } = require("http-status-codes");
const { diff } = require("deep-object-diff");
const jsonDiff = require("json-diff");
const indentString = require("indent-string");
const { stringify } = require("querystring");
const EPSILON = 0.000001;

const compareJSONs = (json1, json2) => {
    const diff = jsonDiff.diffString(json1, json2);
    if (diff) {
        console.log(indentString(chalk.red("A válasz nem az elvárt adatokat tartalmazza:"), 9));
        console.log(indentString(diff, 12));
        throw new Error(`A válasz nem az elvárt adatokat tartalmazza, az eltéréseket lásd fentebb. Ellenőrizheted a ${chalk.gray("database/tester_database.sqlite")} fájlt.`);
    }
};

const seed = async () => {
    try {
        const locationCount = 15;
        const locationNames = faker.helpers.uniqueArray(faker.location.city, locationCount);
        const locations = [];
        for (let i = 0; i < locationCount; i++) {
            locations.push(
                await Location.create({
                    name: locationNames[i],
                    lat: faker.number.float({ min: -90, max: 90 }),
                    lon: faker.number.float({ min: -180, max: 180 }),
                    public: Math.random() < 0.7,
                })
            );
        }
        const warningCount = 5;
        const warnings = [];
        for (let i = 0; i < warningCount; i++) {
            warnings.push(
                await Warning.create({
                    level: 1 + Math.floor(Math.random() * 5),
                    message: Math.random() < 0.5 ? faker.lorem.paragraph() : null,
                })
            );
        }
        const weatherCount = 80;
        for (let i = 0; i < weatherCount; i++) {
            const w = await Weather.create({
                type: faker.helpers.arrayElement(["sunny", "rain", "cloudy", "thunder", "other"]),
                LocationId: faker.helpers.arrayElement(locations).id,
                temp: faker.number.float({ min: -20, max: 40 }),
                loggedAt: faker.date.past({ years: 5 }),
            });
            await w.setWarnings(faker.helpers.arrayElements(warnings));
        }
    } catch (e) {
        console.log("Seeder error");
        console.log(e.message);
        console.log(e.stack);
    }
};

tester(
    // prettier-ignore
    plugins(
        plugin(CategorizedConsoleReporter, { title: "Szerveroldali webprogramozás: Node.js ZH, 2023.05.31." }),
        plugin(TestServer)
        // plugin(PercentageWarningPlugin)
    ),
    url("http://127.0.0.1:4000"),
    timeout(5000),
    init(async () => {
        await migrate();
        await seed();
    }),
    tasks(
        task(
            title("Modellek és kapcsolatok"),
            subtasks(
                subtask(title("Üzenet"), points(0), async (tester, task) => {
                    throw new Error("A modelleket a gyakorlatvezetők kézzel fogják ellenőrizni!");
                })
            )
        ),

        task(
            title("Seeder"),
            subtasks(
                subtask(title("Üzenet"), points(0), async (tester, task) => {
                    throw new Error("A seedert a gyakorlatvezetők kézzel fogják ellenőrizni!");
                })
            )
        ),

        task(
            title("GET /locations"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    task.entities = toJSON(await Location.findAll());
                })
            ),

            subtasks(
                required(title("Helyes kérés küldése a szervernek"), id("exists"), points(0), async (tester, task) => {
                    task.response = await axios.get(tester.url(`/locations`));
                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200)").to.have.property("status", 200);
                }),

                subtask(title("Helyes kérés esetén a megfelelő adatok visszajönnek"), points(1), async (tester, task) => {
                    expect(task.response.data, "A válasz üres").to.be.not.null;
                    expect(task.entities.length, "Az elemek száma nem megfelelő").to.be.equal(task.response.data.length);

                    task.entities = _.orderBy(task.entities, "id");
                    task.response.data = _.orderBy(task.response.data, "id");

                    compareJSONs(
                        task.entities.map((entity) => ({
                            id: parseInt(entity.id),
                            name: entity.name,
                            lat: parseFloat(entity.lat),
                            lon: parseFloat(entity.lon),
                            public: new Boolean(entity.public),
                            createdAt: new Date(entity.createdAt),
                            updatedAt: new Date(entity.updatedAt),
                        })),

                        task.response.data.map((entity) => ({
                            id: parseInt(entity.id),
                            name: entity.name,
                            lat: parseFloat(entity.lat),
                            lon: parseFloat(entity.lon),
                            public: new Boolean(entity.public),
                            createdAt: new Date(entity.createdAt),
                            updatedAt: new Date(entity.updatedAt),
                        }))
                    );
                })
            )
        ),

        task(
            title("GET /locations/:id"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    task.entity = await randomSequelizeEntity(Location);
                })
            ),

            subtasks(
                required(title("Helyes kérés küldése a szervernek"), id("exists"), points(0), async (tester, task) => {
                    task.response = await axios.get(tester.url(`/locations/${task.entity.id}`));
                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200)").to.have.property("status", 200);
                }),

                subtask(title("Helyes kérés esetén a megfelelő adatok visszajönnek"), points(1), id("correct"), async (tester, task) => {
                    expect(task.response.data, "A válasz üres").to.be.not.null;

                    const getProps = (entity) => ({
                        id: parseInt(entity.id),
                        name: entity.name,
                        lat: parseFloat(entity.lat),
                        lon: parseFloat(entity.lon),
                        public: new Boolean(entity.public),
                        createdAt: new Date(entity.createdAt),
                        updatedAt: new Date(entity.updatedAt),
                    });

                    compareJSONs(getProps(task.entity), getProps(task.response.data));
                }),

                subtask(title("Nem létező entitás esetén 404 NOT FOUND válasz jön"), points(0.5), requires("correct"), async (tester, task) => {
                    await expectAxiosStatus(axios.get(tester.url(`/locations/9999999`)), 404);
                }),

                subtask(title("Formailag helytelen azonosító esetén 400 BAD REQUEST válasz jön"), points(0.5), requires("correct"), async (tester, task) => {
                    await expectAxiosStatus(axios.get(tester.url(`/locations/3.1415`)), 400);
                    await expectAxiosStatus(axios.get(tester.url(`/locations/qwe`)), 400);
                })
            )
        ),

        task(
            title("POST /locations"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    // helyes teljes kérés
                    task.correctFull = {
                        name: faker.string.alphanumeric(64),
                        lat: Math.random() * 90,
                        lon: Math.random() * 90,
                        public: true,
                    };
                    // default értékre hajazó kérés
                    task.correctDefault = {
                        name: faker.string.alphanumeric(64),
                        lat: Math.random() * 90,
                        lon: Math.random() * 90,
                    };
                    // hibás kérések
                    task.badBody1 = {
                        name: faker.string.alphanumeric(32),
                        lat: Math.random() * 90,
                        lon: faker.string.alphanumeric(8),
                        public: true,
                    };
                    task.badBody2 = {
                        lat: Math.random() * 90,
                        lon: Math.random() * 90,
                        public: true,
                    };
                    // létező név
                    task.existing = {
                        name: (await randomSequelizeEntity(Location)).name,
                        lat: Math.random() * 90,
                        lon: Math.random() * 90,
                        public: true,
                    };
                })
            ),

            subtasks(
                required(title("Helyes kérés küldése a szervernek"), id("exists"), points(0), async (tester, task) => {
                    task.response = await axios.post(tester.url(`/locations`), task.correctFull);
                    expect(task.response, "A szervertől érkező válasz nem megfelelő (201)").to.have.property("status", 201);
                }),

                subtask(title("A létrejött entitás adatai visszajönnek válaszban"), points(0.25), async (tester, task) => {
                    expect(task.response.data, "A válasz üres").to.be.not.null;

                    const getProps = (entity) => ({
                        name: entity.name,
                        lat: parseFloat(entity.lat),
                        lon: parseFloat(entity.lon),
                        public: new Boolean(entity.public),
                    });

                    compareJSONs(getProps(task.correctFull), getProps(task.response.data));
                }),

                subtask(title("Az entitás létrejön az adatbázisban a megadott adatokkal"), points(0.5), id("fullbody"), async (tester, task) => {
                    const entity = await Location.findOne({ where: { name: task.correctFull.name } });
                    expect(entity, "Az entitás nem található az adatbázisban").to.be.not.null;
                }),

                subtask(title("Helyes kérés küldése a szervernek (public alapértelmezett)"), requires("fullbody"), points(0), async (tester, task) => {
                    task.response2 = await axios.post(tester.url(`/locations`), task.correctDefault);
                    expect(task.response2, "A szervertől érkező válasz nem megfelelő (201)").to.have.property("status", 201);
                }),

                subtask(title("A létrejött entitás adatai visszajönnek válaszban (public alapértelmezett)"), requires("fullbody"), points(0.25), async (tester, task) => {
                    expect(task.response2.data, "A válasz üres").to.be.not.null;
                    expect(task.response2.data, "Nincs public mező a válaszban").to.have.property('public');
                    expect(task.response2.data.public, "A public mező értéke helytelen").to.be.true;

                    const getProps = (entity) => ({
                        name: entity.name,
                        lat: parseFloat(entity.lat),
                        lon: parseFloat(entity.lon),
                        public: new Boolean(entity.public),
                    });

                    compareJSONs(getProps(task.correctDefault), getProps(task.response2.data));
                }),

                subtask(title("Az entitás létrejön az adatbázisban a megadott adatokkal (public alapértelmezett)"), requires("fullbody"), points(0.25), async (tester, task) => {
                    const entity = await Location.findOne({ where: { name: task.correctDefault.name, public: true } });
                    expect(entity, "Az entitás nem található az adatbázisban").to.be.not.null;
                }),

                subtask(title("Hibás kérés esetén 400 BAD REQUEST válasz jön"), points(0.5), requires("fullbody"), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url(`/locations`), task.badBody1), 400);
                    await expectAxiosStatus(axios.post(tester.url(`/locations`), task.badBody2), 400);
                }),

                subtask(title("Nem egyedi név esetén 500 INTERNAL SERVER ERROR válasz jön"), requires("fullbody"), points(0.25), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url(`/locations`), task.existing), 500);
                })
            )
        ),

        task(
            title("DELETE /locations/:id"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    task.entity = await randomSequelizeEntity(Location);
                    task.count = await Location.count();
                })
            ),

            subtasks(
                required(title("Helyes kérés küldése a szervernek"), id("exists"), points(0), async (tester, task) => {
                    task.response = await axios.delete(tester.url(`/locations/${task.entity.id}`));
                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200)").to.have.property("status", 200);
                }),

                subtask(title("Helyes kérés esetén az entitás törlődik"), points(0.5), id("correct"), async (tester, task) => {
                    const count = await Location.count();
                    expect(count, "Nem megfelelő darabszámú entitás törlődött").to.be.equal(task.count - 1);

                    const loc = await Location.findByPk(task.entity.id);
                    expect(loc, "Az megadott azonosítójú entitás nem törlődött").to.be.null;
                }),

                subtask(title("Nem létező entitás esetén 404 NOT FOUND válasz jön"), points(0.25), requires("correct"), async (tester, task) => {
                    await expectAxiosStatus(axios.delete(tester.url(`/locations/9999999`)), 404);
                }),

                subtask(title("Formailag helytelen azonosító esetén 400 BAD REQUEST válasz jön"), points(0.25), requires("correct"), async (tester, task) => {
                    await expectAxiosStatus(axios.delete(tester.url(`/locations/3.1415`)), 400);
                    await expectAxiosStatus(axios.delete(tester.url(`/locations/qwe`)), 400);
                })
            )
        ),

        task(
            title("POST /login"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    task.user = await randomSequelizeEntity(Location);
                    task.email = `location${task.user.id}@weather.org`;
                })
            ),

            subtasks(
                required(title("Helyes e-mail cím esetén 200 OK válasz jön a megfelelő mezővel"), id("successLogin"), points(0.5), async (tester, task) => {
                    task.response = await axios.post(tester.url("/login"), { email: task.email });
                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200 OK)").to.have.property("status", 200);
                    expect(task.response.data, "A válaszban nincs token property").to.have.property("token");
                }),

                subtask(title("Formailag hibás kérés esetén 400 BAD REQUEST válasz jön"), points(0.5), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/login"), {}), 400);
                }),

                subtask(title("A feladattől eltérő e-mail cím esetén 418 I'M A TEAPOT válasz jön"), points(0.5), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/login"), { email: `location3.14@weather.org` }), 418);
                    await expectAxiosStatus(axios.post(tester.url("/login"), { email: `locationqqq@weather.org` }), 418);
                    await expectAxiosStatus(axios.post(tester.url("/login"), { email: `location4@something.org` }), 418);
                }),

                subtask(title("Nem létező mérőhely esetén 404 NOT FOUND válasz jön"), points(0.5), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/login"), { email: `location99999999@weather.org` }), 404);
                }),

                subtask(title('Megfelelő azonosító adat esetén a kapott token érvényes (HS256 algoritmus, "secret" kulccsal aláírva)'), points(0.5), requires("successLogin"), async (tester, task) => {
                    task.decodedToken = jwt.verify(task.response.data.token, "secret");
                }),

                subtask(title("Megfelelő azonosító adat esetén a kapott token payload-jában meg van adva a mérőhely"), points(0.5), requires("successLogin"), async (tester, task) => {
                    const getProps = (base) => ({
                        id: parseInt(base.id),
                        email: base.email,
                        createdAt: new Date(base.createdAt),
                        updatedAt: new Date(base.updatedAt),
                    });

                    compareJSONs(getProps(toJSON(task.user)), getProps(task.decodedToken));
                })
            )
        ),

        task(
            title("GET /local-weather-log"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    // Random bejelentkezett mérőhely
                    task.user = await randomSequelizeEntity(Location);
                    task.token = jwt.sign(toJSON(task.user));
                    task.expected = await Weather.findAll({ where: { LocationId: task.user.id }, order: [["loggedAt", "ASC"]] });
                })
            ),

            subtasks(
                required(title("A végpont hitelesített"), id("authorized"), points(1), async (tester, task) => {
                    await expectAxiosStatus(axios.get(tester.url("/local-weather-log")), 401);
                }),

                required(title("Helyes kérés küldése a szervernek"), id("query"), points(0), async (tester, task) => {
                    // tester.log("Lekérdezés érvényes JWT tokennel");
                    task.response = await axios.get(tester.url("/local-weather-log"), {
                        headers: {
                            Authorization: `Bearer ${task.token}`,
                        },
                    });

                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200 OK)").to.have.property("status", 200);
                }),

                subtask(title("Visszajönnek a megfelelő időjárási adatok bármilyen sorrendben"), points(1), id("correct"), requires("query"), async (tester, task) => {
                    expect(task.expected.length, "Az elemek száma nem megfelelő").to.be.equal(task.response.data.length);
                    expect(
                        task.response.data.map((entity) => entity.id),
                        "A válasz nem a megfelelő elemeket tartalmazza"
                    ).to.have.same.members(task.expected.map((entity) => entity.id));
                }),

                subtask(title("Az időjárási adatok sorrendje megfelelő"), points(1), requires("correct"), async (tester, task) => {
                    expect(
                        task.response.data.map((entity) => entity.id),
                        "A válasz jó elemeket tartalmaz, de nem jó sorrendben"
                    ).to.have.ordered.members(task.expected.map((entity) => entity.id));
                })
            )
        ),

        task(
            title("POST /insert-many"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    // Random bejelentkezett mérőhely
                    task.user = await randomSequelizeEntity(Location);
                    task.token = jwt.sign(toJSON(task.user));
                    task.headers = {
                        headers: {
                            Authorization: `Bearer ${task.token}`,
                        },
                    };
                    // Helyes adatok
                    task.body = {
                        type: faker.string.alphanumeric(32),
                        startTime: faker.date.past(),
                        interval: 5 + Math.floor(Math.random() * 120),
                        temps: Array(3 + Math.floor(Math.random() * 5))
                            .fill(0)
                            .map((_) => Math.random() * 30),
                    };
                    task.before = await Weather.count();
                    // Helytelen kérések
                    task.badBody1 = {
                        type: faker.string.alphanumeric(32),
                        startTime: faker.date.past(),
                        interval: "qqq",
                        temps: Array(3 + Math.floor(Math.random() * 5))
                            .fill(0)
                            .map((_) => Math.random() * 30),
                    };
                    task.badBody2 = {
                        startTime: faker.date.past(),
                        interval: 5 + Math.floor(Math.random() * 120),
                        temps: Array(3 + Math.floor(Math.random() * 5))
                            .fill(0)
                            .map((_) => Math.random() * 30),
                    };
                })
            ),

            subtasks(
                required(title("A végpont hitelesített"), id("authorized"), points(0), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/insert-many")), 401);
                }),

                required(title("Helyes kérés küldése a szervernek"), id("query"), points(0), async (tester, task) => {
                    // tester.log("Lekérdezés érvényes JWT tokennel");
                    task.response = await axios.post(tester.url("/insert-many"), task.body, task.headers);

                    expect(task.response, "A szervertől érkező válasz nem megfelelő (200 OK)").to.have.property("status", 200);
                }),

                subtask(title("A válaszban megfelelő számú elem jön vissza"), points(0.25), id("correct"), requires("query"), async (tester, task) => {
                    expect(task.response.data.length, "Az elemek száma nem megfelelő").to.be.equal(task.body.temps.length);
                }),

                subtask(title("A válaszban szereplő type, LocationId és temp adatok megfelelők"), points(1), id("basic"), requires("correct"), async (tester, task) => {
                    task.response.data = _.orderBy(task.response.data, "id");

                    compareJSONs(
                        task.response.data.map((entity) => ({
                            type: entity.type,
                            LocationId: parseInt(entity.LocationId),
                            temp: parseFloat(entity.temp),
                        })),
                        task.body.temps.map((temp) => ({
                            type: task.body.type,
                            LocationId: parseInt(task.user.id),
                            temp,
                        }))
                    );
                }),

                subtask(title("A válaszban szereplő loggedAt mezők a feladatnak megfelelők"), points(1.5), id("loggedAt"), requires("basic"), async (tester, task) => {
                    const correct = task.body.temps.map((_, i) => new Date(task.body.startTime.getTime() + i * task.body.interval * 60000)).map((d) => d.toString());
                    const received = task.response.data.map((entity) => new Date(entity.loggedAt)).map((d) => d.toString());
                    expect(received, "A loggedAt mezők nem az elvárt értékeket tartalmazzák").to.have.same.ordered.members(correct);
                }),

                subtask(title("Az adatbázisban létrejött entitások minden tekintetben megfelelők"), points(1), requires("loggedAt"), async (tester, task) => {
                    const diff = (await Weather.count()) - task.before;
                    expect(diff, "Az új entitások száma nem megfelelő").to.be.equal(task.body.temps.length);

                    const dbResult = await Weather.findAll({
                        where: { type: task.body.type },
                        order: [
                            ["loggedAt", "ASC"],
                            ["id", "ASC"],
                        ],
                    });
                    
                    compareJSONs(
                        task.body.temps.map((temp, i) => ({
                            type: task.body.type,
                            LocationId: parseInt(task.user.id),
                            temp,
                            loggedAt: new Date(task.body.startTime.getTime() + i * task.body.interval * 60000),
                        })),
                        dbResult.map((entity) => ({
                            type: entity.type,
                            LocationId: entity.LocationId,
                            temp: entity.temp,
                            loggedAt: new Date(entity.loggedAt),
                        }))
                    );
                }),

                subtask(title("Hibás kérés esetén 400 BAD REQUEST válasz érkezik"), points(0.25), requires("loggedAt"), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/insert-many"), task.badBody1, task.headers), 400);
                    await expectAxiosStatus(axios.post(tester.url("/insert-many"), task.badBody2, task.headers), 400);
                })
            )
        ),

        task(
            title("POST /issue-warning"),
            category("rest"),
            hooks(
                beforeAll(async (tester, task) => {
                    // Egy új bejelentkezett mérőhely (kapcsolatai miatt)
                    task.newLocation = await Location.create({
                        name: faker.string.alphanumeric(32),
                        lat: faker.number.float({ min: -90, max: 90 }),
                        lon: faker.number.float({ min: -180, max: 180 }),
                        public: false,
                    });
                    task.token = jwt.sign(toJSON(task.newLocation));
                    task.headers = {
                        headers: {
                            Authorization: `Bearer ${task.token}`,
                        },
                    };
                })
            ),

            subtasks(
                required(title("A végpont hitelesített"), id("authorized"), points(0), async (tester, task) => {
                    await expectAxiosStatus(axios.post(tester.url("/issue-warning")), 401);
                }),

                subtask(title("Ha az időjárásadat nem a bejelentkezett mérőhelyhez tartozik 403 FORBIDDEN válasz jön vissza"), id("check"), points(0.5), async (tester, task) => {
                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WeatherId: (await randomSequelizeEntity(Weather)).id,
                                WarningId: (await randomSequelizeEntity(Warning)).id,
                            },
                            task.headers
                        ),
                        403
                    );
                }),

                subtask(title("Nem létező időjárásadat ID esetén 404 NOT FOUND válasz jön vissza"), requires("check"), points(0.5), async (tester, task) => {
                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WeatherId: 99999999,
                                WarningId: (await randomSequelizeEntity(Warning)).id,
                            },
                            task.headers
                        ),
                        404
                    );
                }),

                subtask(title("Nem létező figyelmeztetés ID esetén 404 NOT FOUND válasz jön vissza"), requires("check"), points(0.25), async (tester, task) => {
                    task.newWeather = await Weather.create({
                        type: faker.helpers.arrayElement(["sunny", "rain", "cloudy", "thunder", "other"]),
                        LocationId: task.newLocation.id,
                        temp: faker.number.float({ min: -20, max: 40 }),
                        loggedAt: faker.date.past({ years: 5 }),
                    });

                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WeatherId: task.newWeather.id,
                                WarningId: 99999999,
                            },
                            task.headers
                        ),
                        404
                    );
                }),

                subtask(title("Ha már volt erre az időjárásadatra ilyen figyelmeztetés kiadva 409 CONFLICT válasz jön"), id("conflict"), requires("check"), points(1), async (tester, task) => {
                    task.newWarning1 = await Warning.create({
                        level: 1 + Math.floor(Math.random() * 5),
                        message: faker.lorem.paragraph(),
                    });

                    task.newWarning2 = await Warning.create({
                        level: 1 + Math.floor(Math.random() * 5),
                        message: faker.lorem.paragraph(),
                    });

                    task.newWeather.setWarnings([task.newWarning1.id, task.newWarning2.id]);

                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WeatherId: task.newWeather.id,
                                WarningId: task.newWarning1.id,
                            },
                            task.headers
                        ),
                        409
                    );
                }),

                subtask(title("Helyes kérés esetén 201 CREATED válasz jön"), requires("conflict"), id("created"), points(0.5), async (tester, task) => {
                    task.newWarning3 = await Warning.create({
                        level: 1 + Math.floor(Math.random() * 5),
                        message: faker.lorem.paragraph(),
                    });

                    task.newWarning4 = await Warning.create({
                        level: 1 + Math.floor(Math.random() * 5),
                        message: faker.lorem.paragraph(),
                    });

                    task.response = await axios.post(
                        tester.url("/issue-warning"),
                        {
                            WeatherId: task.newWeather.id,
                            WarningId: task.newWarning3.id,
                        },
                        task.headers
                    );

                    expect(task.response, "A szervertől érkező válasz nem megfelelő").to.have.property("status", 201);
                }),

                subtask(title("Helyes kérés esetén a kapcsolat helyesen létrejön"), requires("created"), points(1), async (tester, task) => {
                    const relatedEntities = await task.newWeather.getWarnings();
                    const relatedIDs = relatedEntities.map((entity) => entity.id);
                    expect(relatedIDs, "Az kapcsolatok az adatbázisban nem megfelelők").to.have.same.members([task.newWarning1.id, task.newWarning2.id, task.newWarning3.id]);
                }),

                subtask(title("Formailag helytelen kérés esetén 400 BAD REQUEST válasz jön"), points(0.25), async (tester, task) => {
                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WeatherId: task.newWeather.id,
                            },
                            task.headers
                        ),
                        400
                    );
                    await expectAxiosStatus(
                        axios.post(
                            tester.url("/issue-warning"),
                            {
                                WarningId: task.newWarning3.id,
                            },
                            task.headers
                        ),
                        400
                    );
                    await expectAxiosStatus(axios.post(tester.url("/issue-warning"), {}, task.headers), 400);
                })
            )
        ),

        task(
            title("Query.locations és Query.weather"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.locations = await Location.findAll();
                    task.locations = _.orderBy(task.locations, "id");
                    task.weather = await Weather.findAll();
                    task.weather = _.orderBy(task.weather, "id");
                })
            ),
            subtasks(
                subtask(title("Minden mérőhely minden elemi adata visszajön"), points(1), async (tester, task) => {
                    let { locations } = await task.gqlClient.request(gql`
                        query {
                            locations {
                                id
                                name
                                lat
                                lon
                                public
                                createdAt
                                updatedAt
                            }
                        }
                    `);

                    expect(locations.length, "Az elemek száma nem megfelelő").to.be.equal(task.locations.length);

                    locations = locations.map((loc) => ({ ...loc, id: parseInt(loc.id) }));
                    locations = _.orderBy(locations, "id");

                    compareJSONs(
                        locations.map((location) => ({
                            id: location.id,
                            name: location.name,
                            lat: parseFloat(location.lat),
                            lon: parseFloat(location.lon),
                            public: location.public,
                            createdAt: new Date(location.createdAt),
                            updatedAt: new Date(location.updatedAt),
                        })),
                        task.locations.map((location) => ({
                            id: parseInt(location.id),
                            name: location.name,
                            lat: parseFloat(location.lat),
                            lon: parseFloat(location.lon),
                            public: location.public,
                            createdAt: new Date(location.createdAt),
                            updatedAt: new Date(location.updatedAt),
                        }))
                    );
                }),

                subtask(title("Minden időjárásmérés minden elemi adata visszajön"), points(1), async (tester, task) => {
                    let { weather } = await task.gqlClient.request(gql`
                        query {
                            weather {
                                id
                                type
                                LocationId
                                temp
                                loggedAt
                                createdAt
                                updatedAt
                            }
                        }
                    `);

                    expect(weather.length, "Az elemek száma nem megfelelő").to.be.equal(task.weather.length);

                    weather = weather.map((w) => ({ ...w, id: parseInt(w.id) }));
                    weather = _.orderBy(weather, "id");

                    compareJSONs(
                        weather.map((w) => ({
                            id: w.id,
                            type: w.type,
                            LocationId: parseInt(w.LocationId),
                            temp: parseFloat(w.temp),
                            loggedAt: new Date(w.loggedAt),
                            createdAt: new Date(w.createdAt),
                            updatedAt: new Date(w.updatedAt),
                        })),
                        task.weather.map((w) => ({
                            id: w.id,
                            type: w.type,
                            LocationId: parseInt(w.LocationId),
                            temp: parseFloat(w.temp),
                            loggedAt: new Date(w.loggedAt),
                            createdAt: new Date(w.createdAt),
                            updatedAt: new Date(w.updatedAt),
                        }))
                    );
                })
            )
        ),

        task(
            title("Query.location"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.location = await randomSequelizeEntity(Location);
                })
            ),
            subtasks(
                subtask(title("Helyes azonosító esetén visszajönnek a mérőhely adatai"), points(0.75), async (tester, task) => {
                    let { location } = await task.gqlClient.request(gql`
                        query {
                            location (id: ${task.location.id}){
                                id
                                name
                                lat
                                lon
                                public
                                createdAt
                                updatedAt
                            }
                        }
                    `);
                    expect(location, "Nem megfelelő válasz érkezett").to.be.not.null;

                    compareJSONs(
                        {
                            id: parseInt(task.location.id),
                            name: task.location.name,
                            lat: parseFloat(task.location.lat),
                            lon: parseFloat(task.location.lat),
                            public: task.location.public,
                            createdAt: new Date(task.location.createdAt),
                            updatedAt: new Date(task.location.updatedAt),
                        },
                        {
                            id: parseInt(location.id),
                            name: location.name,
                            lat: parseFloat(location.lat),
                            lon: parseFloat(location.lat),
                            public: location.public,
                            createdAt: new Date(location.createdAt),
                            updatedAt: new Date(location.updatedAt),
                        }
                    );
                }),
                subtask(title("Nem létező azonosító esetén null válasz érkezik"), points(0.25), async (tester, task) => {
                    let { location } = await task.gqlClient.request(gql`
                        query {
                            location(id: 99999999) {
                                id
                                name
                            }
                        }
                    `);
                    expect(location, "Nem megfelelő válasz érkezett").to.be.null;
                })
            )
        ),

        task(
            title("Weather.location"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.weather = await Weather.findAll({ include: Location });
                    task.weather = _.orderBy(task.weather, "id");
                })
            ),
            subtasks(
                subtask(title("Minden időjárásméréshez visszajönnek a mérőhely adatai is"), points(1), async (tester, task) => {
                    let { weather } = await task.gqlClient.request(gql`
                        query {
                            weather {
                                id
                                type
                                location {
                                    id
                                    name
                                    lat
                                    lon
                                }
                            }
                        }
                    `);

                    expect(weather.length, "Az elemek száma nem megfelelő").to.be.equal(task.weather.length);

                    weather = weather.map((w) => ({ ...w, id: parseInt(w.id) }));
                    weather = _.orderBy(weather, "id");

                    compareJSONs(
                        weather.map((w) => ({
                            id: w.id,
                            type: w.type,
                            location: {
                                id: parseInt(w.location.id),
                                name: w.location.name,
                                lat: parseFloat(w.location.lat),
                                lon: parseFloat(w.location.lon),
                            },
                        })),
                        task.weather.map((w) => ({
                            id: w.id,
                            type: w.type,
                            location: {
                                id: parseInt(w.Location.id),
                                name: w.Location.name,
                                lat: parseFloat(w.Location.lat),
                                lon: parseFloat(w.Location.lon),
                            },
                        }))
                    );
                })
            )
        ),

        task(
            title("Mutation.createWeather"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));

                    task.correctInput = {
                        type: faker.string.alphanumeric(32),
                        LocationId: (await randomSequelizeEntity(Location)).id,
                        temp: 30 * Math.random(),
                        loggedAt: faker.date.past(),
                    };

                    task.badInput1 = {
                        type: faker.string.alphanumeric(32),
                        LocationId: 99999999,
                        temp: 30 * Math.random(),
                        loggedAt: faker.date.past(),
                    };

                    task.badInput2 = {
                        type: null,
                        LocationId: (await randomSequelizeEntity(Location)).id,
                        temp: 30 * Math.random(),
                        loggedAt: faker.date.past(),
                    };

                    task.badInput3 = {
                        type: faker.string.alphanumeric(32),
                        LocationId: (await randomSequelizeEntity(Location)).id,
                        temp: 30 * Math.random(),
                    };
                })
            ),
            subtasks(
                subtask(title("Helyes bemenet esetén a válaszban visszajön az időjárásadat"), id("correct1"), points(1), async (tester, task) => {
                    const { createWeather } = await task.gqlClient.request(
                        gql`
                            mutation ($input: CreateWeatherInput!) {
                                createWeather(input: $input) {
                                    id
                                    type
                                    LocationId
                                    temp
                                    loggedAt
                                    createdAt
                                    updatedAt
                                }
                            }
                        `,
                        { input: task.correctInput }
                    );

                    task.created = createWeather;
                    compareJSONs(
                        {
                            type: task.created.type,
                            LocationId: parseInt(task.created.LocationId),
                            temp: parseFloat(task.created.temp),
                            loggedAt: new Date(task.created.loggedAt),
                        },
                        {
                            type: task.correctInput.type,
                            LocationId: parseInt(task.correctInput.LocationId),
                            temp: parseFloat(task.correctInput.temp),
                            loggedAt: new Date(task.correctInput.loggedAt),
                        }
                    );
                    expect(task.created, "A válaszban nincs ID mező").to.have.property("id");
                    expect(task.created.id, "A válaszban az ID mező értéke null").to.be.not.null;
                    expect(task.created, "A válaszban nincs createdAt mező").to.have.property("createdAt");
                    expect(task.created.id, "A válaszban a createdAt mező értéke null").to.be.not.null;
                    expect(task.created, "A válaszban nincs updatedAt mező").to.have.property("updatedAt");
                    expect(task.created.id, "A válaszban az updatedAt mező értéke null").to.be.not.null;
                }),
                subtask(title("Helyes bemenet esetén létrejön az entitás az adatbázisban"), requires("correct1"), id("correct2"), points(1), async (tester, task) => {
                    const we = await Weather.findOne({ where: { type: task.correctInput.type, LocationId: task.correctInput.LocationId } });
                    expect(we, "Nem található ilyen entitás az adatbázisban").to.be.not.null;
                    expect(we.id, "Az adatbázisban létrejött entitás ID-je nem egyezik a válasszal").to.be.equal(parseInt(task.created.id));
                }),
                subtask(title("Helytelen paraméterek esetén null válasz vagy hiba érkezik"), requires("correct2"), id("incorrect"), points(0.5), async (tester, task) => {
                    task.countBefore = await Weather.count();
                    let caught = 0;
                    for (const input of [task.badInput1, task.badInput2, task.badInput3]) {
                        try {
                            let { createWeather } = await task.gqlClient.request(
                                gql`
                                    mutation ($input: CreateWeatherInput!) {
                                        createWeather(input: $input) {
                                            id
                                            type
                                            LocationId
                                            temp
                                            loggedAt
                                            createdAt
                                            updatedAt
                                        }
                                    }
                                `,
                                { input }
                            );
                        } catch {
                            caught++;
                        }
                    }
                    expect(caught, "A kapott kivételek/hibák száma nem megfelelő").to.be.equal(3);
                }),
                subtask(title("Helytelen paraméterek esetén nem jön létre entitás"), requires("incorrect"), points(0.5), async (tester, task) => {
                    expect(await Weather.count(), "Az entitások száma megváltozott").to.be.equal(task.countBefore);
                })
            )
        ),

        task(
            title("Weather.warnings"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.data = await Weather.findAll({ include: Warning });
                    task.related = [];
                    for (const we of task.data) {
                        for (const wa of we.Warnings) {
                            task.related.push({ WeatherId: parseInt(we.id), WarningId: parseInt(wa.id) });
                        }
                    }
                })
            ),
            subtasks(
                subtask(title("Helyesen visszajönnek az időjárásmérésekhez tartozó figyelmezetések"), points(1), async (tester, task) => {
                    let { weather } = await task.gqlClient.request(gql`
                        query {
                            weather {
                                id
                                temp
                                warnings {
                                    id
                                    level
                                    message
                                }
                            }
                        }
                    `);
                    let related = [];
                    for (const we of weather) {
                        for (const wa of we.warnings) related.push({ WeatherId: parseInt(we.id), WarningId: parseInt(wa.id) });
                    }
                    expect(related).to.have.same.deep.members(task.related);
                    task.received = weather;
                }),
                subtask(title("A figyelmeztetések sorrendje megfelelő"), points(1), async (tester, task) => {
                    for (const we of task.received) {
                        if (we.warnings.length > 1) {
                            for (let i = 1; i < we.warnings.length; i++) expect(we.warnings[i - 1].level, "Van rossz sorrendű figyelmezetés").to.be.greaterThanOrEqual(we.warnings[i].level);
                        }
                    }
                })
            )
        ),

        task(
            title("Location.currentTemp"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.newLocations = [];
                    for (let i = 0; i < 3; i++) {
                        task.newLocations.push(
                            await Location.create({
                                name: faker.string.alphanumeric(32),
                                lat: faker.number.float({ min: -90, max: 90 }),
                                lon: faker.number.float({ min: -180, max: 180 }),
                                public: Math.random() < 0.7,
                            })
                        );
                    }
                    let maxLoggedAt = new Date("1970-01-01T00:00:00Z");
                    for (let i = 0; i < 6; i++) {
                        const temp = faker.number.float({ min: -20, max: 40 });
                        const loggedAt = faker.date.past({ years: 5 });
                        await Weather.create({
                            type: faker.string.alphanumeric(32),
                            LocationId: i == 0 ? task.newLocations[0].id : task.newLocations[1].id,
                            loggedAt,
                            temp,
                        });
                        if (i == 0) task.correct1 = temp;
                        else if (loggedAt > maxLoggedAt) {
                            maxLoggedAt = loggedAt;
                            task.correctN = temp;
                        }
                    }
                })
            ),
            subtasks(
                subtask(title("Helyes válasz, ha a mérőhelyhez csak egy időjárásadat tartozik"), id("single"), points(1), async (tester, task) => {
                    let { locations } = await task.gqlClient.request(gql`
                        query {
                            locations {
                                id
                                currentTemp
                            }
                        }
                    `);
                    task.resp = locations;
                    expect(task.resp, "A válasz nem megfelelő").to.be.not.null;
                    const watched = task.resp.find((l) => parseInt(l.id) === task.newLocations[0].id);
                    expect(watched, "Nem található a válaszban a megadott mérőhely").to.be.not.null;
                    expect(watched, "Nem található a válaszban a mérőhelyhez hőmérséklet").to.have.property("currentTemp");
                    expect(watched.currentTemp).to.be.closeTo(task.correct1, EPSILON);
                }),
                subtask(title("Helyes válasz, ha a mérőhelyhez több időjárásadat is tartozik"), requires("single"), id("moredata"), points(1.5), async (tester, task) => {
                    expect(task.resp, "A válasz nem megfelelő").to.be.not.null;
                    const watched = task.resp.find((l) => parseInt(l.id) === task.newLocations[1].id);
                    expect(watched, "Nem található a válaszban a megadott mérőhely").to.be.not.null;
                    expect(watched, "Nem található a válaszban a mérőhelyhez hőmérséklet").to.have.property("currentTemp");
                    expect(watched.currentTemp).to.be.closeTo(task.correctN, EPSILON);
                }),
                subtask(title("Helyes válasz, ha a mérőhelyhez nincs egyetlen időjárásadat sem"), requires("single"), points(0.5), async (tester, task) => {
                    expect(task.resp, "A válasz nem megfelelő").to.be.not.null;
                    const watched = task.resp.find((l) => parseInt(l.id) === task.newLocations[2].id);
                    expect(watched, "Nem található a válaszban a megadott mérőhely").to.be.not.null;
                    expect(watched, "Nem található a válaszban a mérőhelyhez hőmérséklet").to.have.property("currentTemp");
                    expect(watched.currentTemp, "Nem null érték jött vissza hőmérsékletként").to.be.null;
                })
            )
        ),

        task(
            title("Mutation.setPublic"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));
                    task.newLocations = [];
                    for (let i = 0; i < 2; i++) {
                        task.newLocations.push(
                            await Location.create({
                                name: faker.string.alphanumeric(32),
                                lat: faker.number.float({ min: -90, max: 90 }),
                                lon: faker.number.float({ min: -180, max: 180 }),
                                public: i > 0,
                            })
                        );
                    }
                })
            ),
            subtasks(
                subtask(title("Nem létező mérőhely esetén NOT FOUND válasz"), id("notfound"), points(0.5), async (tester, task) => {
                    let { setPublic } = await task.gqlClient.request(gql`
                        mutation {
                            setPublic(LocationId: 999999, public: true)
                        }
                    `);
                    expect(setPublic.toUpperCase()).to.be.equal("NOT FOUND");
                }),
                subtask(title("Eleve megfelelő beállítás esetén ALREADY SET válasz"), requires("notfound"), id("found"), points(0.75), async (tester, task) => {
                    let { setPublic } = await task.gqlClient.request(gql`
                        mutation {
                            setPublic (LocationId: ${task.newLocations[0].id}, public: false)
                        }
                    `);
                    expect(setPublic.toUpperCase()).to.be.equal("ALREADY SET");
                    ({ setPublic } = await task.gqlClient.request(gql`
                        mutation {
                            setPublic (LocationId: ${task.newLocations[1].id}, public: true)
                        }
                    `));
                    expect(setPublic.toUpperCase()).to.be.equal("ALREADY SET");
                }),
                subtask(title("Változtatás esetén CHANGED válasz"), requires("found"), id("changed"), points(0.75), async (tester, task) => {
                    let { setPublic } = await task.gqlClient.request(gql`
                        mutation {
                            setPublic (LocationId: ${task.newLocations[0].id}, public: true)
                        }
                    `);
                    expect(setPublic.toUpperCase()).to.be.equal("CHANGED");
                    ({ setPublic } = await task.gqlClient.request(gql`
                        mutation {
                            setPublic (LocationId: ${task.newLocations[1].id}, public: false)
                        }
                    `));
                    expect(setPublic.toUpperCase()).to.be.equal("CHANGED");
                }),
                subtask(title("Változtatások az adatbázisban is érvényesülnek"), requires("changed"), points(1), async (tester, task) => {
                    const l0 = await Location.findByPk(task.newLocations[0].id);
                    expect(l0.public, "A public mező értéke nem megfelelő a változtatások után").to.be.true;
                    const l1 = await Location.findByPk(task.newLocations[1].id);
                    expect(l1.public, "A public mező értéke nem megfelelő a változtatások után").to.be.false;
                })
            )
        ),

        task(
            title("Query.statistics"),
            category("gql"),
            hooks(
                beforeAll(async (tester, task) => {
                    // GraphQL client létrehozása a feladathoz
                    task.gqlClient = new GraphQLClient(tester.url("/graphql"));

                    task.correct = {
                        locationCount: await Location.count(),
                        averageTemp: (await Weather.findAll()).reduce((s, w) => w.temp + s, 0) / (await Weather.count()),
                        over30Celsius: await Weather.count({ where: { temp: { [Op.gt]: 30 } } }),
                        multipleWarnings: (await Weather.findAll({ include: Warning })).filter((w) => w.Warnings.length >= 2).length,
                        mostActiveLocation: (await Location.findAll({ include: Weather, order: [["id", "ASC"]] })).reduce((r, l) => (l.Weather.length > r.Weather.length ? l : r), { Weather: [] }),
                    };
                })
            ),
            subtasks(
                subtask(title("locationCount"), points(1), async (tester, task) => {
                    const { statistics } = await task.gqlClient.request(gql`
                        query {
                            statistics {
                                locationCount
                            }
                        }
                    `);
                    expect(statistics.locationCount, "Helytelen eredmény").to.be.equal(task.correct.locationCount);
                }),
                subtask(title("averageTemp"), points(1), async (tester, task) => {
                    const { statistics } = await task.gqlClient.request(gql`
                        query {
                            statistics {
                                averageTemp
                            }
                        }
                    `);
                    expect(statistics.averageTemp, "Helytelen eredmény").to.be.closeTo(task.correct.averageTemp, EPSILON);
                }),
                subtask(title("over30Celsius"), points(1), async (tester, task) => {
                    const { statistics } = await task.gqlClient.request(gql`
                        query {
                            statistics {
                                over30Celsius
                            }
                        }
                    `);
                    expect(statistics.over30Celsius, "Helytelen eredmény").to.be.equal(task.correct.over30Celsius);
                }),
                subtask(title("multipleWarnings"), points(1), async (tester, task) => {
                    const { statistics } = await task.gqlClient.request(gql`
                        query {
                            statistics {
                                multipleWarnings
                            }
                        }
                    `);
                    expect(statistics.multipleWarnings, "Helytelen eredmény").to.be.equal(task.correct.multipleWarnings);
                }),
                subtask(title("mostActiveLocation"), points(1), async (tester, task) => {
                    const { statistics } = await task.gqlClient.request(gql`
                        query {
                            statistics {
                                mostActiveLocation {
                                    id
                                    name
                                    lat
                                    lon
                                }
                            }
                        }
                    `);

                    expect(statistics.mostActiveLocation, "A válasz nem egy mérőhely!").to.have.property("id");
                    expect(statistics.mostActiveLocation, "A válasz nem egy mérőhely!").to.have.property("name");
                    expect(statistics.mostActiveLocation, "A válasz nem egy mérőhely!").to.have.property("lat");
                    expect(statistics.mostActiveLocation, "A válasz nem egy mérőhely!").to.have.property("lon");

                    compareJSONs(
                        {
                            id: parseInt(task.correct.mostActiveLocation.id),
                            name: task.correct.mostActiveLocation.name,
                            lat: parseFloat(task.correct.mostActiveLocation.lat),
                            lon: parseFloat(task.correct.mostActiveLocation.lon),
                        },
                        {
                            id: parseInt(statistics.mostActiveLocation.id),
                            name: statistics.mostActiveLocation.name,
                            lat: parseFloat(statistics.mostActiveLocation.lat),
                            lon: parseFloat(statistics.mostActiveLocation.lon),
                        }
                    );
                })
            )
        )
    )
);
