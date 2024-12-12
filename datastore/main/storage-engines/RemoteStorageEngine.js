"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql_engine_1 = require("@ulixee/sql-engine");
const AbstractStorageEngine_1 = require("./AbstractStorageEngine");
const queryMetadataKeys = [
    'id',
    'version',
    'authentication',
    'payment',
    'affiliateId',
    'queryId',
    'domain',
];
class RemoteStorageEngine extends AbstractStorageEngine_1.default {
    constructor(connectionToCore, metadata) {
        super();
        this.connectionToCore = connectionToCore;
        this.metadata = metadata;
    }
    filterLocalTableCalls(_entityCalls) {
        return [];
    }
    close() {
        this.connectionToCore = null;
        return Promise.resolve();
    }
    async query(sql, boundValues, metadata, virtualEntitiesByName, callbacks) {
        if (sql instanceof sql_engine_1.SqlParser) {
            sql = sql.toSql();
        }
        metadata ??= {};
        let options = {};
        for (const key of queryMetadataKeys) {
            const entry = metadata[key] ?? this.metadata[key];
            if (entry)
                options[key] = entry;
        }
        if (callbacks?.beforeStorageEngine)
            options = callbacks.beforeStorageEngine(options);
        const result = await this.connectionToCore.sendRequest({
            command: 'Datastore.queryStorageEngine',
            args: [
                {
                    ...options,
                    sql,
                    boundValues,
                    virtualEntitiesByName,
                },
            ],
        });
        if (metadata?.onQueryResult) {
            await metadata.onQueryResult(result);
        }
        if (result.runError)
            throw result.runError;
        return result.outputs;
    }
    async createRemote(version, previousVersion) {
        await this.connectionToCore.sendRequest({
            command: 'Datastore.createStorageEngine',
            args: [
                {
                    version,
                    previousVersion,
                },
            ],
        });
    }
    createTable() {
        throw new Error('Invalid call on a remote Storage Engine');
    }
}
exports.default = RemoteStorageEngine;
//# sourceMappingURL=RemoteStorageEngine.js.map