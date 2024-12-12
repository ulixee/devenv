"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const defaults_1 = require("../lib/defaults");
describe('basic Client tests', () => {
    it('automatically parses the connection string', async () => {
        const client = new index_1.default('ulx://username:password@domain.com:1818/database');
        const { user, password, host, port, database } = client;
        expect(user).toBe('username');
        expect(password).toBe('password');
        expect(host).toBe('domain.com');
        expect(port).toBe(1818);
        expect(database).toBe('database');
    });
    it('should parse a postgres string as well', async () => {
        const client = new index_1.default('postgres://username:password@domain.com:1818/database@v1.0.0');
        const { user, password, host, port, database } = client;
        expect(user).toBe('username');
        expect(password).toBe('password');
        expect(host).toBe('domain.com');
        expect(port).toBe(1818);
        expect(database).toBe('database@v1.0.0');
    });
    it('accepts a connection object', async () => {
        const client = new index_1.default({
            user: 'username',
            password: 'password',
            host: 'domain.com',
            port: 1818,
            database: 'database'
        });
        // @ts-ignore
        const { user, password, host, port, database } = client;
        expect(user).toBe('username');
        expect(password).toBe('password');
        expect(host).toBe('domain.com');
        expect(port).toBe(1818);
        expect(database).toBe('database');
    });
    it('uses defaults when values are not supplied', async () => {
        const client = new index_1.default();
        const { user, password, host, port, database } = client;
        expect(user).toBe(defaults_1.default.user);
        expect(password).toBe(undefined);
        expect(host).toBe('localhost');
        expect(port).toBe(1818);
        expect(database).toBe(undefined);
    });
});
//# sourceMappingURL=basic.test.js.map