"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionString_1 = require("./ConnectionString");
const defaults_1 = require("./defaults");
class ConnectionParameters {
    constructor(config) {
        // if a string is passed, it is a raw connection string so we parse it into a config
        config = typeof config === 'string' ? ConnectionString_1.default.parse(config) : config || {};
        // if the config has a connectionString defined, parse IT into the config we use
        // this will override other default values with what is stored in connectionString
        if (config.connectionString) {
            config = { ...config, ...ConnectionString_1.default.parse(config.connectionString) };
        }
        this.user = config.user || defaults_1.default.user;
        this.password = config.password || defaults_1.default.password;
        this.database = config.database || defaults_1.default.database;
        this.port = parseInt(config.port || defaults_1.default.port, 10);
        this.host = config.host || defaults_1.default.host;
        // "hiding" the password so it doesn't show up in stack traces
        // or if the client is console.logged
        Object.defineProperty(this, 'password', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: config.password || defaults_1.default.password,
        });
    }
}
exports.default = ConnectionParameters;
//# sourceMappingURL=ConnectionParameters.js.map