"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // database host. defaults to localhost
    host: 'localhost',
    // database user's name
    user: undefined,
    // name of database to connect
    database: undefined,
    // database user's password
    password: undefined,
    // a Ulixee connection string to be used instead of setting individual connection items
    // NOTE:  Setting this value will cause it to override any other value (such as database or user) defined
    // in the defaults object.
    connectionString: undefined,
    // database port
    port: 1818,
    // number of rows to return at a time from a prepared statement's
    // portal. 0 will return all rows at once
    rows: 0,
    options: undefined,
    parseInputDatesAsUTC: false,
    // max milliseconds any query using this connection will execute for before timing out in error.
    // false=unlimited
    statement_timeout: false,
    // max milliseconds to wait for query to complete (client side)
    query_timeout: false,
    connect_timeout: 0,
};
//# sourceMappingURL=defaults.js.map