const TesterPlugin = require("./plugin.js");
const chalk = require("chalk");

class PercentageWarning extends TesterPlugin {
    constructor(tester, logger) {
        super(tester, logger);
        return this;
    }

    async load() {}

    async unload(error) {}

    onTesterEnd({ totalTasks, testedTasks, percentage }) {
        // Ha minden feladat tesztelve volt, de az eredmény alacsonyabb 40%-nál
        if (totalTasks === testedTasks && percentage < 40) {
            this._logger.reporter(chalk.red("  A tesztelő eredményei tájékoztató jellegűek, azonban vedd figyelembe,"));
            this._logger.reporter(chalk.red("  hogy a sikeres zárthelyihez legalább 40%-os eredményt kell elérni!"));
        }
    }
}

module.exports = PercentageWarning;
