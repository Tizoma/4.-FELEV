const TesterPlugin = require("./plugin.js");
const ss = require("superstruct");
const _ = require("lodash");
const execa = require("execa");
const chalk = require("chalk");
const url = require("url");
const ffp = require("find-free-port");

class TestServer extends TesterPlugin {
    constructor(tester, logger, config) {
        super(tester);

        this._process = null;
        this._running = false;

        // Alapértelmezett beállítások
        this._config = {
            executor: "node",
            args: [],
            server: "server.js",
            signal: "AUTOTESTER_API_SERVER_STARTED",
            minPort: 50000,
            maxPort: 60000,
            ip: "127.0.0.1",
        };
        this._validateConfig(config);
        // Átírja az alapértelmezett configban azt, amit át kell
        if (config) this._config = _.merge({}, this._config, config);

        return this;
    }

    _validateConfig(config) {
        const configValidator = ss.optional(
            ss.object({
                executor: ss.optional(ss.string()),
                args: ss.optional(ss.array(ss.string())),
                target: ss.optional(ss.string()),
                server: ss.optional(ss.string()),
                signal: ss.optional(ss.string()),
                // TODO: min < max
                minPort: ss.optional(ss.integer()),
                maxPort: ss.optional(ss.integer()),
            })
        );
        ss.assert(config, configValidator);
    }

    async _findPort() {
        const [port] = await ffp(this._config.minPort, this._config.maxPort, this._config.ip);
        return port;
    }

    async runTestServer() {
        const port = await this._findPort();
        const result = new Promise((resolve, reject) => {
            try {
                if (this._config.executor === "node") {
                    this._process = execa.node(this._config.server, this._config.args, {
                        // A szerver ezt az .env-et fogja látni. A NODE_ENV értékét test-re kell állítani, mivel így a
                        // Sequelize configjából a test rész fog lefutni (lásd a models mappában az index.js kódját).
                        env: {
                            NODE_ENV: "test",
                            PORT: port,
                        },
                    });
                } else if (this._config.executor === "php") {
                    this._process = execa("php", [`-S 127.0.0.1:${port}`, `-t ${this._config.target}`], {
                        windowsVerbatimArguments: true,
                    });
                }
                this._process.catch((err) => {
                    // A SIGTERM nem hiba, hiszen a processt el kell kaszálni a tesztelés végén.
                    if (err.hasOwnProperty("signal") && err.signal === "SIGTERM") return;

                    // Minden más esetben logolnunk kell, mivel egyáltalán nem biztos, hogy a
                    // hallgató kódja nem hasal el, ezt az esetet kezeljük itt. A logolás által
                    // pedig a hallgató is láthatja, mi szállt el a programjában.
                    console.log(chalk.red("HIBA."));
                    console.log(err);
                    console.log();
                    console.log(err.stdout);
                    console.log(err.stderr);
                    this._running = false;
                });

                this._process.stderr.on("data", (data) => {
                    if (this._config.executor === "php" && /PHP [\d.]+ Development Server \(http\:\/\/127\.0\.0\.1:50000\) started/.test(data.toString())) {
                        this._running = true;
                        resolve(port);
                    }
                });

                // A kezdőcsomagok úgy vannak beállítva, hogyha a szerver elindult,
                // akkor a konzolon megjelenik egy üzenet (signal). Ezt meg kell várni.
                // Amint megjelenik a konzolon a jel, feloldjuk a portot.
                this._process.on("message", (message) => {
                    if (this._config.executor === "node" && message.toString().startsWith(this._config.signal)) {
                        this._running = true;
                        resolve(port);
                    }
                });

                // this._process.stdout.on("data", (data) => {
                //     if (this._config.executor === "node" && data.toString().startsWith(this._config.signal)) {
                //         this._running = true;
                //         resolve(port);
                //     }
                // });
            } catch (err) {
                // Ha valamilyen hiba történik a Promise belsejében, akkor reject()-et küldünk, benne a hibával
                reject({ isError: true, error: err });
            }
        });
        if (!result.hasOwnProperty("isError")) {
            // TODO
            this._tester.ctx.testServerPort = port;
            const parsed = url.parse(this._tester.ctx.baseUrl);
            this._tester.ctx.baseUrl = `http://${parsed.hostname}:${port}`;
        }
        return result;
    }

    stopTestServer() {
        if (this._process) {
            this._process.kill("SIGTERM", {
                forceKillAfterTimeout: 1000,
            });
            this._running = false;
        }
    }

    async load() {
        await this.runTestServer();
    }

    async unload() {
        this.stopTestServer();
    }
}

module.exports = TestServer;
