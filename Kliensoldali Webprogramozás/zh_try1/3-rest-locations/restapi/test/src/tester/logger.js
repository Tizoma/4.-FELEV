const chalk = require("chalk");
const _ = require("lodash");
const ss = require("superstruct");

class Logger {
    constructor(config) {
        // Behúzás mértéke
        this._indents = 0;

        // Alapértelmezett beállítások
        this._config = {
            // Reporter által kiírt dolgok megjelenítése
            showReporter: true,
            // Egyedileg kiírt dolgok megjelenítése
            showCustom: true,
            // Debug dolgok megjelenítése
            showDebug: true,
        };
        this._validateConfig(config);
        // Átírja az alapértelmezett configban azt, amit át kell
        if (config) this._config = _.merge({}, this._config, config);
    }

    /**
     * Ellenőrzi a megadott konfigurációt
     * @param config - A logger lehetséges konfigurációja, amit ellenőrizni kell
     * @throws StructError - Ha hibás a konfiguráció felépítése, akkor hibát fog dobni
     * @return {undefined}
     */
    _validateConfig(config) {
        const configValidator = ss.optional(
            ss.object({
                showReporter: ss.optional(ss.boolean()),
                showCustom: ss.optional(ss.boolean()),
                showDebug: ss.optional(ss.boolean()),
            })
        );
        ss.assert(config, configValidator);
    }

    debug(...args) {
        if (this._config.showDebug === true) console.log(this._indent(), chalk.yellow("[debug]"), ...args);
    }

    reporter(...args) {
        if (this._config.showReporter === true) console.log(this._indent(), ...args);
    }

    reporter2(...args) {
        if (this._config.showReporter === true) process.stdout.write([this._indent(), ...args].join(" "));
    }

    log(...args) {
        if (this._config.showCustom === true) return console.log(this._indent(), chalk.gray("  [log]"), ...args);
    }

    log2(...args) {
        if (this._config.showCustom === true) return process.stdout.write([this._indent(), chalk.gray("  [log]"), ...args].join(" "));
    }

    println(...args) {
        if (this._config.showCustom === true) return console.log(this._indent(), ...args);
    }

    print(...args) {
        if (this._config.showCustom === true) return process.stdout.write([this._indent(), ...args].join(" "));
    }

    _indent() {
        return Array(this._indents).join("  ");
    }

    increaseIndent() {
        this._indents++;
    }

    decreaseIndent() {
        this._indents--;
    }
}

module.exports = Logger;
