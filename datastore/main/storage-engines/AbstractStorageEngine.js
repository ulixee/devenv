"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractStorageEngine {
    constructor() {
        this.inputsByName = {};
        this.schemasByName = {};
        this.virtualTableNames = new Set();
        this.sqlTableNames = new Set();
        this.isBound = false;
    }
    bind(datastore) {
        if (this.isBound)
            return;
        for (const [name, extractor] of Object.entries(datastore.extractors)) {
            this.schemasByName[name] = extractor.schema?.output ?? {};
            this.inputsByName[name] = extractor.schema?.input ?? {};
        }
        for (const [name, crawler] of Object.entries(datastore.crawlers)) {
            this.schemasByName[name] = crawler.schema?.output ?? {};
            this.inputsByName[name] = crawler.schema?.input ?? {};
        }
        for (const [name, table] of Object.entries(datastore.tables)) {
            this.schemasByName[name] = table.schema;
            if ('remoteSource' in table)
                this.virtualTableNames.add(name);
            else
                this.sqlTableNames.add(name);
        }
        Object.freeze(this.schemasByName);
        Object.freeze(this.inputsByName);
        Object.freeze(this.virtualTableNames);
        this.isBound = true;
    }
    async create(datastore, previousVersion) {
        for (const table of Object.values(datastore.tables)) {
            // don't create upstream tables
            if ('remoteSource' in table)
                continue;
            const schema = table.schema;
            await this.createTable(table.name, schema);
            await table.onCreated?.call(table);
        }
        await datastore.onCreated?.call(datastore);
        if (previousVersion) {
            for (const table of Object.values(datastore.tables)) {
                const previousTable = previousVersion.tables[table.name];
                if (previousTable)
                    await table.onVersionMigrated?.call(table, previousTable);
            }
            await datastore.onVersionMigrated?.call(datastore, previousVersion);
        }
    }
    recordToEngineRow(record, schema, inputSchema, tmpSchemaFieldTypes = {}) {
        for (const key of Object.keys(record)) {
            const fieldSchema = inputSchema?.[key] ?? schema[key];
            const typeName = fieldSchema?.typeName;
            const [convertedValue, tmpType] = this.adapter.toEngineValue(typeName, record[key]);
            record[key] = convertedValue;
            if (tmpType)
                tmpSchemaFieldTypes[key] = tmpType;
        }
        for (const key of Object.keys(schema || {})) {
            if (key in record)
                continue;
            record[key] = null;
        }
        return record;
    }
    recordsFromEngine(records, schemas, tmpSchemaFieldTypes = {}) {
        const schemasByField = {};
        for (const schema of schemas) {
            for (const [field, entry] of Object.entries(schema)) {
                schemasByField[field] = entry;
            }
        }
        for (const record of records) {
            for (const key of Object.keys(record)) {
                // TODO: intelligently handle multiple typeNames
                const field = schemasByField[key]?.typeName;
                record[key] = this.adapter.fromEngineValue(field || tmpSchemaFieldTypes[key], record[key]);
            }
        }
        return records;
    }
}
exports.default = AbstractStorageEngine;
//# sourceMappingURL=AbstractStorageEngine.js.map