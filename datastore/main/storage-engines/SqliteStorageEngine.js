"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SqliteStorageEngine_db;
Object.defineProperty(exports, "__esModule", { value: true });
const sql_engine_1 = require("@ulixee/sql-engine");
const SqliteAdapter_1 = require("@ulixee/sql-engine/adapters/SqliteAdapter");
const Database = require("better-sqlite3");
const AbstractStorageEngine_1 = require("./AbstractStorageEngine");
class SqliteStorageEngine extends AbstractStorageEngine_1.default {
    constructor(storagePath = ':memory:') {
        super();
        _SqliteStorageEngine_db.set(this, void 0);
        this.adapter = new SqliteAdapter_1.default();
        const opts = {}; // { verbose: console.log }
        __classPrivateFieldSet(this, _SqliteStorageEngine_db, new Database(storagePath, opts), "f");
        __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").unsafeMode(false);
        __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").pragma('journal_mode = WAL');
        __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").pragma('synchronous = FULL');
        this.path = storagePath;
    }
    async close() {
        __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").pragma('wal_checkpoint(TRUNCATE)');
        __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").close();
    }
    filterLocalTableCalls(entityCalls) {
        return entityCalls.filter(x => this.sqlTableNames.has(x));
    }
    query(sql, boundValues, _metadata, virtualEntitiesByName) {
        const sqlParser = typeof sql === 'string' ? new sql_engine_1.SqlParser(sql) : sql;
        const schemas = [];
        const tmpSchemaFieldTypes = {};
        for (const name of sqlParser.tableNames) {
            if (this.schemasByName[name])
                schemas.push(this.schemasByName[name]);
        }
        if (virtualEntitiesByName) {
            for (const [name, virtualEntity] of Object.entries(virtualEntitiesByName)) {
                const inputSchema = this.inputsByName[name];
                let parameters;
                if (virtualEntity.parameters || inputSchema) {
                    parameters = Array.from(new Set([
                        ...Object.keys(virtualEntity.parameters ?? {}),
                        ...Object.keys(inputSchema ?? {}),
                    ]));
                }
                const schema = this.schemasByName[name];
                const columns = Array.from(new Set([...Object.keys(schema ?? {}), ...Object.keys(virtualEntity.records[0] ?? [])]));
                schemas.push(schema);
                const rows = virtualEntity.records.map(row => this.recordToEngineRow(row, schema, inputSchema, tmpSchemaFieldTypes));
                const tableOptions = {
                    columns,
                    *rows() {
                        for (const row of rows) {
                            yield row;
                        }
                    },
                };
                if (parameters)
                    tableOptions.parameters = parameters;
                __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").table(name, tableOptions);
            }
        }
        const valueMap = this.convertBoundValuesToMap(boundValues);
        const parsedSql = sqlParser.toSql();
        if (sqlParser.isInsert() || sqlParser.isDelete() || sqlParser.isUpdate()) {
            if (sqlParser.hasReturn() === true) {
                return __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").prepare(parsedSql).all(valueMap);
            }
            const result = __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").prepare(parsedSql).run(valueMap);
            return { changes: result?.changes };
        }
        if (!sqlParser.isSelect())
            throw new Error('Invalid SQL command');
        const records = __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").prepare(parsedSql).all(valueMap);
        return Promise.resolve(this.recordsFromEngine(records, schemas, tmpSchemaFieldTypes));
    }
    async createTable(name, schema) {
        const columns = Object.keys(schema).map(key => `${key} ${this.adapter.toEngineType(schema[key].typeName)}`);
        await __classPrivateFieldGet(this, _SqliteStorageEngine_db, "f").exec(`CREATE TABLE "${name}" (${columns.join(', ')})`);
    }
    convertBoundValuesToMap(boundValues) {
        const record = {};
        let index = 1;
        for (const value of boundValues) {
            record[index++] = this.adapter.toEngineValue(null, value)[0];
        }
        return record;
    }
}
_SqliteStorageEngine_db = new WeakMap();
exports.default = SqliteStorageEngine;
//# sourceMappingURL=SqliteStorageEngine.js.map