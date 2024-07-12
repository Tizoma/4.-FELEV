// Utilityk
const chalk = require("chalk");
const _ = require("lodash");
const ss = require("superstruct");
const url = require("url");

// Mocha
const Mocha = require("mocha");
const { Test, Suite } = Mocha;

const Logger = require("./logger");
const Reporter = require("./reporter");
const PluginManager = require("./pluginmanager");

// Alapértelmezett tesztelő konfiguráció
const defaultConfig = {
    // A Mocha timeout-ja
    timeout: 2000,
    // Naplózás engedélyezése
    logging: true,
};

class Tester {
    constructor(config) {
        this._logger = new Logger();
        this._initConfig(config);
        this._initMocha();
        this._initSuiteMethods();
    }

    _initConfig(config) {
        this._validateConfig(config);
        this._config = _.merge({}, defaultConfig, config);
    }

    _initMocha() {
        // Mocha létrehozása, majd a timeout és a saját reporter beállítása
        this._mocha = new Mocha();
        //this._mocha.parallelMode(true); // TODO

        this._mocha.timeout(this._config.timeout);

        // Gyökér suite, ami alá az összes feladat tartozik:
        this._suite = Suite.create(this._mocha.suite, "Feladatok");
        this._suite.tasksRoot = true;
        this._suite.plugins = {};
        this._suite.ctx = {};

        this._plugins = new PluginManager(this._suite, this._logger);

        // prettier-ignore
        this._mocha.reporter(Reporter, {
            plugins: this._plugins,
            logger: this._logger
        });
    }

    _initSuiteMethods() {
        // Logolás
        this._suite.ctx.log = (...args) => this._logger.log(...args);
        this._suite.ctx.log2 = (...args) => this._logger.log2(...args);
        this._suite.ctx.print = (...args) => this._logger.print(...args);
        this._suite.ctx.println = (...args) => this._logger.println(...args);

        // URL kezelés
        this._suite.ctx.baseUrl = this._config.baseUrl;

        this._suite.ctx.url = (part) => {
            if (!part) return this._suite.ctx.baseUrl;
            return url.resolve(this._suite.ctx.baseUrl, part);
        };
    }

    async _addSuiteHooks() {
        this._suite.afterAll(async () => {
            // Ha a tesztelő végzett, az összes plugin "unload" metódusát meg kell hívni és
            // meg kell várni. Pl. ha fut egy headless browser, vagy más process, akkor
            // a tesztelés végén ugyanis enékül "beakad" a konzol!
            await Promise.all(this._plugins.invokeInAllPlugins("unload"));
        });
    }

    async _loadPlugins() {
        for (let plugin of this._config.plugins) {
            await this._plugins.addPlugin(plugin);
        }
        await Promise.all(this._plugins.invokeInAllPlugins("afterAllPluginsLoaded"));
    }

    /**
     * Ellenőrzi a megadott konfigurációt
     * @param config - A tesztelő lehetséges konfigurációja, amit ellenőrizni kell
     * @throws StructError - Ha hibás a konfiguráció felépítése, akkor hibát fog dobni
     * @return {undefined}
     */
    _validateConfig(config) {
        const configValidator = ss.object({
            baseUrl: ss.optional(ss.nonempty(ss.string())),
            timeout: ss.optional(ss.min(ss.integer(), 500)),
            logging: ss.optional(ss.boolean()),
            tasks: ss.object(),
            init: ss.optional(ss.func()),
            plugins: ss.array(),
        });
        ss.assert(config, configValidator);
    }

    async _generateTests() {
        this._tests = [];
        for (let [index, taskObject] of Object.entries(this._config.tasks)) {
            this._tests.push(async (tester) => {
                // Feladat létrehozása
                let task = Suite.create(tester, taskObject.title);
                task.taskNumber = parseInt(index) + 1;
                task.category = taskObject.category;
                task.isTask = true;
                task.totalPoints = 0;
                task.failedSubtasks = {};

                // Hookok bindolása
                if (taskObject.hooks) {
                    for (let [hookName, hookFn] of Object.entries(taskObject.hooks)) {
                        if (typeof hookFn !== "function") continue;
                        task[hookName](async () => {
                            await hookFn(tester.ctx, task.ctx, this._plugins.plugins);
                        });
                    }
                }

                // Feladat előfeltétele (ez egy beforeAll hook, de a hozzáadott hook-ok UTÁN fut le - ez fontos)
                if (taskObject.prerequisite) {
                    const prerequisiteFn = taskObject.prerequisite;
                    if (typeof prerequisiteFn === "function") {
                        task["beforeAll"](async () => {
                            try {
                                await prerequisiteFn(tester.ctx, task.ctx, this._plugins.plugins);
                            } catch (error) {
                                // Ha sérül a feladat előfeltétele, eltároljuk a task objektumban, hogy milyen hiba keletkezett
                                task.prerequisiteError = error;
                            }
                        });
                    }
                }

                // Alfeladatok (subtaskok) hozzáadása
                for (let subtaskData of taskObject.subtasks) {
                    let subtask = new Test(subtaskData.title, async () => {
                        if (task.prerequisiteError) {
                            throw new Error("A feladat előfeltétele nem teljesült");
                        }
                        for (const requiredSubtask of subtaskData.requires) {
                            if (Object.keys(task.failedSubtasks).includes(requiredSubtask)) {
                                throw new Error(`Ez a részfeladat megköveteli a(z) \"${task.failedSubtasks[requiredSubtask]}\" című részfeladat hibátlan megoldását!`);
                            }
                        }
                        await subtaskData.fn(tester.ctx, task.ctx, this._plugins.plugins);
                    });
                    subtask.isSubtask = true;
                    subtask.isRequired = subtaskData.required === true ? true : false;
                    subtask.points = subtaskData.points;
                    if (subtaskData.hasOwnProperty("id")) {
                        subtask.subtaskId = subtaskData.id;
                    }
                    task.totalPoints += subtaskData.points;
                    task.addTest(subtask);
                }
                return task;
            });
        }
    }

    async _runInitializer() {
        if (typeof this._config.init === "function") {
            //process.stdout.write(chalk.white("   * Inicializálás... "));
            await this._config.init();
            //this._logger.reporter(chalk.green("OK."));
        }
    }

    async _addTests(processArgs) {
        this._testedTasks = [];
        const args = processArgs.slice(2);
        // Ha a hallgató megadott konkrét feladatokat paraméterben, akkor azok közül
        // kiválogatjuk az érvényes sorszámúakat, és azokat jelöljük tesztelésre
        if (args && args.length > 0) {
            for (const arg of args) {
                const n = parseInt(arg);
                if (!isNaN(n) && n >= 1 && n <= this._tests.length) {
                    this._testedTasks.push(n);
                } else {
                    // Ha a hallgató által megadott paraméterek egyike nem érvényes
                    // feladat sorszám, azt jelenítsük meg a hallgatónak
                    await Promise.all(this._plugins.invokeInAllPlugins("onInvalidTaskNumberDetected", n));
                }
            }
        }
        // Ha pedig nem adott meg paramétert, alapértelmezés szerint minden feladatot
        // tesztelünk
        else {
            this._testedTasks = Array.from(Array(this._tests.length), (_, i) => i + 1); // Számok tömbje 1-től N-ig
        }

        // A fő suite-nak átadjuk, hogy hány feladat lesz tesztelve.
        // Ha a hallgató nem adott meg semmit, akkor az összes lehetséges
        // feladatot teszteljük. Ha a hallgató paraméterezte a programot,
        // akkor az imént kiválogatott érvényes sorszámok számát adjuk át.
        this._suite.testedTasksCount = this._testedTasks.length > 0 ? this._testedTasks.length : this._tests.length;

        // Továbbá átadjuk azt is, hogy összesen hány feladat van, függetlenül
        // attól, hogy mennyit tesztelünk. Ez pontosan annyi lesz, mint amennyi
        // feladatot reprezentáló fv fel van véve a configban.
        // Erre azért van szükség, mivel ha az összes feladatot hibátlanul oldja meg,
        // akkor pl. megjelenik neki egy gratuláció, de ezt részfeladatoknál nem akarjuk.
        this._suite.totalTasksCount = this._tests.length;

        if (this._testedTasks.length > 0) {
            // Jelenítsük meg a hallgatónak, hogy mely sorszámú feladatokat jelölte ki tesztelésre
            await Promise.all(this._plugins.invokeInAllPlugins("onTasksMarkedForTesting", this._testedTasks));

            // A tesztelni kívánt feladatok tesztelő függvényeit rakjuk be a fő suite-ba,
            // mint "al suite-ok"
            // Fontos, hogy ilyenkor ezek a fv-ek meghívásra is kerülnek, de a szabály úgy szól,
            // hogy a közvetlen függvénytörzsben csak további task-okat lehet definiálni, így
            // azok is hozzáadásra kerülnek.
            for (let taskId of this._testedTasks) {
                await this._tests[taskId - 1](this._suite);
            }
        } else {
            throw new Error("Egy feladat sem lett tesztelésre kijelölve!");
        }
    }

    _runMocha() {
        this._mocha.run();
    }

    async run(processArgs) {
        await this._loadPlugins();
        await this._runInitializer();
        await this._generateTests();
        await this._addSuiteHooks();
        try {
            await this._addTests(processArgs);
            this._runMocha();
        } catch (e) {
            // Ha a tesztelő futtatása során bármilyen hiba történik, arról visszajelzést kell adni
            console.log(" ");
            console.log(" ");
            console.log(chalk.red(" ** A tesztelő hibával állt le!"));
            console.log(chalk.red(`  A hiba: ${e.message}`));
            await Promise.all(this._plugins.invokeInAllPlugins("unload", e));
        }
    }
}

module.exports = Tester;
