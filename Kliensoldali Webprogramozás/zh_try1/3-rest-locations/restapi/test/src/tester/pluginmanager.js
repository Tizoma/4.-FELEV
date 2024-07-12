const inflection = require("inflection");

class PluginManager {
    constructor(rootSuite, logger) {
        this._rootSuite = rootSuite;
        this._logger = logger;
        this._plugins = {};
    }

    // Név átalakítása a JS elnevezési konvenciók szerint, pl HelloWorld -> helloWorld
    _camelizeName(name) {
        return inflection.camelize(name, true);
    }

    async addPlugin(plugin) {
        // Kétféle plugin típus lehet megadva:
        //      - sima require
        //      - sima require + config, egy objectbe ágyazva
        //  [require(...), { module: require(...), config: {...} }]
        //
        if (typeof plugin === "object") {
            // { module: require(...) } / { module: require(...), config: {...} } esetek
            if (plugin.hasOwnProperty("module") && typeof plugin.module === "function") {
                const name = this._camelizeName(plugin.module.name);
                // Plugin konstruktorának meghívása
                if (plugin.hasOwnProperty("config") && typeof plugin.config === "object") {
                    this._plugins[name] = new plugin.module(this._rootSuite, this._logger, plugin.config);
                } else {
                    this._plugins[name] = new plugin.module(this._rootSuite, this._logger);
                }
                // Mivel a konstruktor nem tud async-et, kell egy async fv, a load(), ezt hívjuk meg
                // közvetlenül a plugin megkonstruálása után
                await this._plugins[name].load();
            }
        }
        // require(...) eset
        else if (typeof plugin === "function") {
            const name = this._camelizeName(plugin.name);
            this._plugins[name] = new plugin(this._rootSuite, this._logger);
            await this._plugins[name].load();
        }
    }

    invokeInAllPlugins(fn, ...args) {
        let result = [];
        for (let [_, plugin] of Object.entries(this._plugins)) {
            if (typeof plugin[fn] === "function") {
                result.push(plugin[fn](...args));
            }
        }
        return result;
    }

    get plugins() {
        return this._plugins; // TODO
    }
}

module.exports = PluginManager;
