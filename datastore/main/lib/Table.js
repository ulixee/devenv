"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Table_datastoreInternal;
Object.defineProperty(exports, "__esModule", { value: true });
const addGlobalInstance_1 = require("@ulixee/commons/lib/addGlobalInstance");
const sql_engine_1 = require("@ulixee/sql-engine");
const DatastoreInternal_1 = require("./DatastoreInternal");
class Table {
    get basePrice() {
        return BigInt(this.components.basePrice ?? 0);
    }
    get isPublic() {
        return this.components.isPublic !== false;
    }
    get schema() {
        return this.components.schema;
    }
    get name() {
        return this.components.name ?? 'default';
    }
    get description() {
        return this.components.description;
    }
    constructor(components) {
        _Table_datastoreInternal.set(this, void 0);
        this.components = { ...components };
    }
    onCreated() {
        return this.components.onCreated?.call(this);
    }
    onVersionMigrated(previousVersion) {
        return this.components.onVersionMigrated?.call(this, previousVersion);
    }
    get datastoreInternal() {
        if (!__classPrivateFieldGet(this, _Table_datastoreInternal, "f")) {
            __classPrivateFieldSet(this, _Table_datastoreInternal, new DatastoreInternal_1.default({ tables: { [this.name]: this } }), "f");
        }
        return __classPrivateFieldGet(this, _Table_datastoreInternal, "f");
    }
    async fetchInternal(options, callbacks) {
        const name = this.name;
        const { sql, boundValues } = sql_engine_1.SqlGenerator.createWhereClause(name, options?.input, ['*'], 1000);
        return this.queryInternal(sql, boundValues, options, callbacks);
    }
    async insertInternal(...records) {
        const engine = this.datastoreInternal.storageEngine;
        const inserts = sql_engine_1.SqlGenerator.createInsertsFromRecords(this.name, this.schema, ...records);
        for (const { sql, boundValues } of inserts) {
            await engine.query(sql, boundValues);
        }
    }
    async queryInternal(sql, boundValues = [], options, _callbacks) {
        const name = this.name;
        const engine = this.datastoreInternal.storageEngine;
        const sqlParser = new sql_engine_1.SqlParser(sql, { table: name });
        return await engine.query(sqlParser, boundValues, options);
    }
    attachToDatastore(datastoreInternal, tableName) {
        this.components.name = tableName;
        if (__classPrivateFieldGet(this, _Table_datastoreInternal, "f") && __classPrivateFieldGet(this, _Table_datastoreInternal, "f") === datastoreInternal)
            return;
        if (__classPrivateFieldGet(this, _Table_datastoreInternal, "f")) {
            throw new Error(`${tableName} Table is already attached to a Datastore`);
        }
        __classPrivateFieldSet(this, _Table_datastoreInternal, datastoreInternal, "f");
    }
    bind(config) {
        return this.datastoreInternal.bind(config ?? {});
    }
}
_Table_datastoreInternal = new WeakMap();
exports.default = Table;
(0, addGlobalInstance_1.default)(Table);
//# sourceMappingURL=Table.js.map