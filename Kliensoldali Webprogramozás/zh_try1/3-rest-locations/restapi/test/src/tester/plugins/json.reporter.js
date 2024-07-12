const TesterPlugin = require("./plugin.js");

class JsonReporter extends TesterPlugin {
    constructor(tester, logger, config) {
        super(tester);
        this._report = {};
        return this;
    }

    async load() {}

    async unload() {
        this.log(this._report);
    }

    onTaskBegin({ task }) {
        this._report[task.title] = {};
    }

    onSubtaskEnd({ task, subtask, passed }) {
        this._report[task.title][subtask.title] = passed ? "Jó megoldás" : "Hibás megoldás";
    }

    onTaskEnd({ task, totalPoints, gainedPoints }) {
        this._report[task.title]["totalPoints"] = totalPoints;
        this._report[task.title]["gainedPoints"] = gainedPoints;
    }
}

module.exports = JsonReporter;
