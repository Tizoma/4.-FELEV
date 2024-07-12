// Mocha események
const EVENT_HOOK_BEGIN = "hook";
const EVENT_HOOK_END = "hook end";
const EVENT_RUN_BEGIN = "start";
const EVENT_DELAY_BEGIN = "waiting";
const EVENT_DELAY_END = "ready";
const EVENT_RUN_END = "end";
const EVENT_SUITE_BEGIN = "suite";
const EVENT_SUITE_END = "suite end";
const EVENT_TEST_BEGIN = "test";
const EVENT_TEST_END = "test end";
const EVENT_TEST_FAIL = "fail";
const EVENT_TEST_PASS = "pass";
const EVENT_TEST_PENDING = "pending";
const EVENT_TEST_RETRY = "retry";
// const STATE_IDLE = "idle";
// const STATE_RUNNING = "running";
// const STATE_STOPPED = "stopped";

// Saját reporter a Mocha-hoz, ami ki van egészítve pontozással és az eseménykezelő
// metódusokat is meghívja a pluginokban
// https://mochajs.org/api/tutorial-custom-reporter.html
class Reporter {
    constructor(runner, options) {
        // Referencia a tesztelőbe importált pluginokra
        this._plugins = options.reporterOptions.plugins;

        // Összes megszerezhető pont a TESZTELT feladatokból
        this._totalPoints = 0;

        // A tesztelés során összesen megszerzett pontok
        this._gainedPoints = 0;

        // A tesztelésre kijelölt feladatok száma
        this._totalTasks = 0;

        // A teljesen megoldott feladatok száma (a tesztelőn hibátlanul átment minden feladat alá tartozó részfeladat)
        this._solvedTasks = 0;

        // A részben megoldott feladatok száma (a tesztelőn legalább egy, de nem az összes részfeladat ment át hibátlanul)
        this._partiallySolvedTasks = 0;

        // Tesztelt feladatok száma
        this._testedTasksCount = 0;

        // Az összes feladat száma (ebbe beleszámítanak azok is, amik éppen nem lettek tesztelésre jelölve)
        this._totalTasksCount = 0;

        runner
            .once(EVENT_RUN_BEGIN, () => {
                this._plugins.invokeInAllPlugins("onTesterBegin", {
                    testedTasksCount: this._testedTasksCount,
                });
            })
            .on(EVENT_DELAY_BEGIN, () => {
                this._plugins.invokeInAllPlugins("onDelayBegin");
            })
            .on(EVENT_DELAY_END, () => {
                this._plugins.invokeInAllPlugins("onDelayEnd");
            })
            .on(EVENT_SUITE_BEGIN, (suite) => {
                if (suite.hasOwnProperty("testedTasksCount") && suite.hasOwnProperty("totalTasksCount")) {
                    this._testedTasksCount = suite.testedTasksCount;
                    this._totalTasksCount = suite.totalTasksCount;
                }
                if (suite.hasOwnProperty("isTask") && suite.isTask === true && suite.hasOwnProperty("totalPoints")) {
                    this._totalTasks++;
                    this._totalPoints += suite.totalPoints;
                }
                this._plugins.invokeInAllPlugins("onSuiteBegin", { suite });
                if (suite.isTask === true) {
                    this._plugins.invokeInAllPlugins("onTaskBegin", {
                        task: suite,
                    });
                }
            })
            .on(EVENT_SUITE_END, (suite) => {
                if (suite.hasOwnProperty("isTask") && suite.isTask === true) {
                    let gained = suite.hasOwnProperty("gainedPoints") ? suite.gainedPoints : 0;
                    let total = suite.hasOwnProperty("totalPoints") ? suite.totalPoints : 0;
                    this._gainedPoints += gained;
                    if (gained < total && gained > 0) {
                        this._partiallySolvedTasks++;
                    } else if (gained >= total && total > 0) {
                        this._solvedTasks++;
                    }
                    this._plugins.invokeInAllPlugins("onTaskEnd", {
                        task: suite,
                        totalPoints: total,
                        gainedPoints: gained,
                    });
                }
                this._plugins.invokeInAllPlugins("onSuiteEnd");
            })
            .on(EVENT_HOOK_BEGIN, (hook) => {
                this._plugins.invokeInAllPlugins("onHookBegin", { hook });
            })
            .on(EVENT_HOOK_END, (hook) => {
                this._plugins.invokeInAllPlugins("onHookEnd", { hook });
            })
            .on(EVENT_TEST_BEGIN, (test) => {
                this._plugins.invokeInAllPlugins("onTestBegin", {
                    parent: test.parent,
                    test,
                });
                if (test.isSubtask === true) {
                    this._plugins.invokeInAllPlugins("onSubtaskBegin", {
                        task: test.parent,
                        subtask: test,
                    });
                }
            })
            .on(EVENT_TEST_END, (test) => {
                const passed = test.state === "passed";
                this._plugins.invokeInAllPlugins("onTestEnd", { test });
                if (test.isSubtask === true) {
                    this._plugins.invokeInAllPlugins("onSubtaskEnd", {
                        task: test.parent,
                        subtask: test,
                        passed,
                    });
                }
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                test.failReason = err;
                if (test.hasOwnProperty("subtaskId")) {
                    test.parent.failedSubtasks[test.subtaskId] = test.title;
                }
                this._plugins.invokeInAllPlugins("onEventTestFail", {
                    parent: test.parent,
                    test,
                    error: err,
                });
                if (test.isSubtask === true) {
                    this._plugins.invokeInAllPlugins("onSubtaskFailed", {
                        task: test.parent,
                        subtask: test,
                        error: err,
                    });
                }
            })
            .on(EVENT_TEST_PASS, (test) => {
                //this._logger.reporter(chalk.green(`* ${test.title}`), chalk.green(`(${test.points} pont)`));
                // A parent-ben növeljük az elért pontok számát
                if (!test.parent.hasOwnProperty("gainedPoints")) {
                    test.parent.gainedPoints = test.points;
                } else {
                    test.parent.gainedPoints += test.points;
                }
                this._plugins.invokeInAllPlugins("onEventTestPass", {
                    parent: test.parent,
                    test,
                });
                if (test.isSubtask === true) {
                    this._plugins.invokeInAllPlugins("onSubtaskPassed", {
                        task: test.parent,
                        subtask: test,
                    });
                }
            })
            .on(EVENT_TEST_PENDING, (test) => {
                this._plugins.invokeInAllPlugins("onTestPending", {
                    parent: test.parent,
                    test,
                });
            })
            .on(EVENT_TEST_RETRY, (test) => {
                this._plugins.invokeInAllPlugins("onTestRetry", {
                    parent: test.parent,
                    test,
                });
            })
            .once(EVENT_RUN_END, () => {
                // Ha nincs egyik feladathoz se pont rendelve, ne osszunk nullával
                let percentage = Math.round(this._totalPoints === 0 ? 0 : (this._gainedPoints / this._totalPoints) * 100);
                // Ha 100%-os eredmény jött ki és minden lehgetséges feladat tesztelve volt, az azt jelenti,
                // hogy a hallgató hibátlanul oldotta meg a dolgozatot a tesztelő szerint
                const isfullSolution = percentage === 100 && this._testedTasksCount == this._totalTasksCount;
                this._plugins.invokeInAllPlugins("onRunEnd");
                this._plugins.invokeInAllPlugins("onTesterEnd", {
                    totalTasks: this._totalTasksCount,
                    testedTasks: this._testedTasksCount,
                    solvedTasks: this._solvedTasks,
                    partiallySolvedTasks: this._partiallySolvedTasks,
                    totalPoints: this._totalPoints,
                    gainedPoints: this._gainedPoints,
                    percentage,
                    isfullSolution,
                });
            });
    }
}

module.exports = Reporter;
