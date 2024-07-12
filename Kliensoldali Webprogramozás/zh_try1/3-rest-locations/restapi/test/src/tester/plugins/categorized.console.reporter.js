const TesterPlugin = require("./plugin.js");
const chalk = require("chalk");
const ss = require("superstruct");
const _ = require("lodash");
const { table, getBorderCharacters } = require('table');

class CategorizedConsoleReporter extends TesterPlugin {
    _nn = (n, decimals = 0) => String(n.toFixed(decimals)).padStart(2 + decimals + (decimals > 0 ? 1 : 0), " ");

    _percentFormat(numerator, denominator) {
        if (denominator <= 0) return chalk.gray("---.--%");

        const str = `${((100 * numerator) / denominator).toFixed(2).padStart(6, " ")}%`;

        if (numerator / denominator < 0.4)  return chalk.bgRed.white(str); // 1
        if (numerator / denominator < 0.55) return chalk.ansi256(166)(str); // 2
        if (numerator / denominator < 0.7)  return chalk.yellow(str); // 3
        if (numerator / denominator < 0.85) return chalk.blue(str); // 4
        if (numerator / denominator < 0.99) return chalk.green(str); // 5
        return chalk.bgGreenBright.black(str); // 5*
    }

    constructor(tester, logger, config) {
        super(tester, logger);

        // Kategóriánkénti eredményszámoló... összegző táblázat miatt legyen ez a 2 kategória benne mindig
        this._byCategory = {
            rest: {
                testedTasks: 0,
                solvedTasks: 0,
                gainedPoints: 0,
                totalPoints: 0,
            },
            gql: {
                testedTasks: 0,
                solvedTasks: 0,
                gainedPoints: 0,
                totalPoints: 0,
            },
        };

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
        if (!this._byCategory.hasOwnProperty(task.category)) {
            this._byCategory[task.category] = {
                testedTasks: 0,
                solvedTasks: 0,
                gainedPoints: 0,
                totalPoints: 0,
            };
        }
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
        this._byCategory[task.category].testedTasks += 1;
        this._byCategory[task.category].solvedTasks += gainedPoints === totalPoints ? 1 : 0;
        this._byCategory[task.category].gainedPoints += gainedPoints;
        this._byCategory[task.category].totalPoints += totalPoints;
        this.println(" ");
        this.decreaseIndent();
    }

    onTesterEnd({ totalPoints, gainedPoints, isfullSolution }) {
        this.decreaseIndent();
        this._logger.reporter("");
        this._logger.reporter(`  ${chalk.underline("Áttekintés")}`);
        this._logger.reporter("");

        const data = [
            ['', 'Feladatok', 'Pontszám', 'Százalék'],
            ['I.   Sequelize', chalk.gray('A gyakorlatvezető kézzel értékeli.'), '', ''],
            ['II.  REST API', `${this._nn(this._byCategory.rest.solvedTasks)} / ${this._nn(this._byCategory.rest.testedTasks)}`, `${this._nn(this._byCategory.rest.gainedPoints, 2)} / ${this._nn(this._byCategory.rest.totalPoints, 2)}`, this._percentFormat(this._byCategory.rest.gainedPoints, this._byCategory.rest.totalPoints)],
            ['III. GraphQL', `${this._nn(this._byCategory.gql.solvedTasks)} / ${this._nn(this._byCategory.gql.testedTasks)}`, `${this._nn(this._byCategory.gql.gainedPoints, 2)} / ${this._nn(this._byCategory.gql.totalPoints, 2)}`, this._percentFormat(this._byCategory.gql.gainedPoints, this._byCategory.gql.totalPoints)],
            [chalk.cyan('II. + III. összesen'), chalk.cyan(`${this._nn(this._byCategory.rest.solvedTasks + this._byCategory.gql.solvedTasks )} / ${this._nn(this._byCategory.rest.testedTasks + this._byCategory.gql.testedTasks)}`), chalk.cyan(`${this._nn(gainedPoints, 2)} / ${this._nn(totalPoints, 2)}`), this._percentFormat(gainedPoints, totalPoints)],
        ]

        console.log(table(data, {
            border: getBorderCharacters('void'),
            columns: [
                { paddingLeft: 8, alignment: 'left' },
                { alignment: 'center' },
                { alignment: 'center' },
                { alignment: 'center' }
            ],
            columnDefault: {
                paddingLeft: 2,
                paddingRight: 2
            },
            drawHorizontalLine: () => false,
            spanningCells: [
                { col: 1, row: 1, colSpan: 3 }
            ]
        }))

        // Ha minden feladat tesztelve volt, és az eredmény így is teljes megoldást mutat, akkor
        // megjelenítünk egy gratulációs üzenetet
        if (isfullSolution) {
            this._logger.reporter("");
            this._logger.reporter(chalk.green("  Úgy tűnik, minden megvan! Gratulálunk, nagyon ügyes vagy! :)"));
        }

        this._logger.reporter("");
        this._logger.reporter(chalk.yellow("  * Emlékeztetünk, hogy a tesztelő eredménye csak tájékoztató jellegű."));
        this._logger.reporter(chalk.yellow("  * A tényleges értékelés ettől pozitív és negatív irányba is eltérhet!"));
    }
}

module.exports = CategorizedConsoleReporter;
