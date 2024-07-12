const TesterPlugin = require("./plugin.js");
const chalk = require("chalk");
const ss = require("superstruct");
const _ = require("lodash");

class ConsoleReporter extends TesterPlugin {
    constructor(tester, logger, config) {
        super(tester, logger);

        // Alapértelmezett beállítások
        this._config = {
            title: null,
            // Fontos információk megjelenítése sárgával a tesztelő indulásakor
            notice: {
                enabled: true,
                content: [
                    "A tesztelő eredményei csak tájékoztató jellegűek, a végleges értékelés ettől eltérhet!",
                    "A tesztelő csak egy segédprogram a visszajelzésekhez, NEM a dolgozat kötelező része!",
                    "Mindent meg kell tudni csinálni a gyakorlatokon vett eszközökkel is, tesztelő nélkül!",
                ],
            },
        };
        this._validateConfig(config);
        // Átírja az alapértelmezett configban azt, amit át kell
        if (config) this._config = _.merge({}, this._config, config);
        return this;
    }

    async load() {}

    async unload(error) {}

    _validateConfig(config) {
        const configValidator = ss.object({
            title: ss.optional(ss.nonempty(ss.string())),
            notice: ss.optional(
                ss.object({
                    enabled: ss.optional(ss.boolean()),
                    content: ss.optional(ss.array(ss.string())),
                })
            ),
        });
        ss.assert(config, configValidator);
    }

    _showTitle() {
        this.increaseIndent();
        if (this._config.hasOwnProperty("title") && typeof this._config.title === "string" && this._config.title.trim().length) {
            this.reporter(chalk.green(`** ${this._config.title} **`));
        } else {
            this.reporter(chalk.green("** Automata tesztelő **"));
        }
    }

    _showNotice() {
        this.increaseIndent();
        if (this._config.hasOwnProperty("notice") && this._config.notice.enabled !== false) {
            for (let line of this._config.notice.content) {
                this.reporter(chalk.yellow(`* ${line}`));
            }
        }
    }

    // Legelőször a pluginok töltődnek be, utána indul minden más, így a címet itt meg lehet jeleníteni
    afterAllPluginsLoaded() {
        this._showTitle();
        this.println(" ");
        this._showNotice();
        this.println(" ");
    }

    // Akkor hívódik meg, ha egy megadott feladat sorszámról kiderül, hogy rossz
    onInvalidTaskNumberDetected(taskNumber) {
        this.println(chalk.yellow(`* Érvénytelen sorszám: ${taskNumber}`));
    }

    // Akkor hívódik meg, ha megvan a tesztelésre kijelölt feladatok listája
    onTasksMarkedForTesting(tasks) {
        this.println(chalk.white("* Tesztelésre kijelölt feladatok sorszámai: " + chalk.gray(tasks.join(", ")) + "."));
    }

    // Akkor hívódik meg, amikor a Mocha futása elkezdődik
    onTesterBegin() {
        this.println(" ");
        this.increaseIndent();
    }

    // Amikor egy feladat tesztelése elkezdődik, írjuk ki a feladat nevét, valahogy így:
    // X. feladat: FELADAT NEVE (Y pont)
    onTaskBegin({ task }) {
        this.reporter(`${task.taskNumber}. feladat: ${task.title} ${chalk.gray(`(${task.totalPoints} pont)`)}`);
        this.increaseIndent();
    }

    // Amikor egy részfeladat elkezdődik, kiírjuk a nevét
    onSubtaskBegin({ task, subtask }) {
        if (!task.prerequisiteError) {
            this.reporter(chalk.gray(`* ${subtask.title} (${subtask.points} pont)`));
        }
    }

    // Amikor egy részfeladat véget ér, kiírjuk, hogy sikerült-e megoldani. Ha igen, akkor az annyi részpontot jelent, egyébként pedig semmit.
    onSubtaskEnd({ task, subtask, passed }) {
        if (!task.prerequisiteError) {
            this.increaseIndent();
            if (passed) {
                this.reporter(chalk.green(`${subtask.points}/${subtask.points} pont`));
            } else {
                this.reporter(chalk.red(`0/${subtask.points} pont`));
            }
            this.decreaseIndent();
        }
    }

    onSubtaskFailed({ task, error }) {
        if (!task.prerequisiteError) {
            this.increaseIndent();
            this.reporter(chalk.red(error.message));
            this.decreaseIndent();
        }
    }

    // Amikor egy feladat véget ér, megjelenítjük, hogy mennyi pontot sikerült az adott feladatból elérni.
    // - Ha semmit, akkor pirossal,
    // - ha nem mindet, csak részpontokat, akkor sárgával,
    // - ha mindent sikerült megszerezni, akkor zölddel.
    onTaskEnd({ task, totalPoints, gainedPoints }) {
        if (task.prerequisiteError) {
            this.reporter(chalk.red(task.prerequisiteError.message));
        }
        let color = chalk.white;
        if (gainedPoints < totalPoints && gainedPoints > 0) {
            color = chalk.yellow;
        } else if (gainedPoints < totalPoints && gainedPoints === 0) {
            color = chalk.red;
        } else if (gainedPoints >= totalPoints && totalPoints > 0) {
            color = chalk.green;
        }
        this.reporter(color(`* Feladat: ${gainedPoints}/${totalPoints} pont`));
        this.println(" ");
        this.decreaseIndent();
    }

    onTesterEnd({ totalTasks, testedTasks, solvedTasks, partiallySolvedTasks, totalPoints, gainedPoints, percentage, isfullSolution }) {
        this.decreaseIndent();
        this._logger.reporter("");
        this._logger.reporter("* Statisztika:");
        this._logger.reporter(`  * Tesztelt feladatok:\t${testedTasks}/${totalTasks}`);
        if (solvedTasks) {
            this._logger.reporter(`  * Hibátlan feladatok:\t${solvedTasks}/${testedTasks}`);
        }
        if (partiallySolvedTasks) {
            this._logger.reporter(`  * Részpontos feladatok:\t${partiallySolvedTasks}/${testedTasks}`);
        }
        this._logger.reporter("");
        this._logger.reporter(`  ### Pontok összesen: ${gainedPoints}/${totalPoints} (${percentage}%) ###`);

        // Ha minden feladat tesztelve volt, és az eredmény így is teljes megoldást mutat, akkor
        // megjelenítünk egy gratulációs üzenetet
        if (isfullSolution) {
            this._logger.reporter(chalk.green("  Úgy tűnik, minden megvan! Gratulálunk, nagyon ügyes vagy! :)"));
        }
    }
}

module.exports = ConsoleReporter;
