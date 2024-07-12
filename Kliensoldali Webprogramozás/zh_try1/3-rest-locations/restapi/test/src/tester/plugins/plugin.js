class TesterPlugin {
    constructor(tester, logger, config) {
        // Referencia szerint átvesszük a tesztelő kontextusát
        this._tester = tester;
        this._logger = logger;
        // A tesztelő kontextusába felvesszük a plugint
        return this;
    }

    async load() {}

    async unload() {}

    log(...args) {
        this._logger.log(...args);
    }

    log2(...args) {
        this._logger.log2(...args);
    }

    print(...args) {
        this._logger.print(...args);
    }

    println(...args) {
        this._logger.println(...args);
    }

    reporter(...args) {
        this._logger.reporter(...args);
    }

    reporter2(...args) {
        this._logger.reporter2(...args);
    }

    debug(...args) {
        this._logger.debug(...args);
    }

    increaseIndent() {
        this._logger.increaseIndent();
    }

    decreaseIndent() {
        this._logger.decreaseIndent();
    }
}

module.exports = TesterPlugin;
