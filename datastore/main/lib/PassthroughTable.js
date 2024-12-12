"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql_engine_1 = require("@ulixee/sql-engine");
const node_assert_1 = require("node:assert");
const Table_1 = require("./Table");
class PassthroughTable extends Table_1.default {
    constructor(components) {
        super(components);
        (0, node_assert_1.strict)(components.remoteTable, 'A remote table is required');
        (0, node_assert_1.strict)(components.remoteTable.includes('.'), 'A remote table source is required');
        const [source, remoteTable] = components.remoteTable.split('.');
        this.remoteTable = remoteTable;
        this.remoteSource = source;
    }
    async queryInternal(sql, boundValues = [], options, callbacks) {
        callbacks.onPassthroughTable ??= (_name, opts, run) => run(opts);
        return callbacks.onPassthroughTable(this.name, options, async (modifiedOptions) => {
            await this.injectRemoteClient();
            // if we queried our own table, replace that now with an external table
            if (this.name !== this.remoteTable) {
                const sqlParser = new sql_engine_1.SqlParser(sql, {}, { [this.name]: this.remoteTable });
                sql = sqlParser.toSql();
            }
            const result = await this.upstreamClient.query(this.remoteDatastoreId, this.remoteVersion, sql, {
                boundValues,
                ...modifiedOptions,
                paymentService: this.datastoreInternal.remotePaymentService,
                domain: this.remoteDomain,
            });
            if (result.runError)
                throw result.runError;
            return result.outputs;
        });
    }
    async injectRemoteClient() {
        if (this.upstreamClient)
            return;
        const { datastoreHost, client } = await this.datastoreInternal.getRemoteApiClient(this.remoteSource);
        this.remoteDatastoreId = datastoreHost.datastoreId;
        this.remoteVersion = datastoreHost.version;
        this.remoteDomain = datastoreHost.domain;
        this.upstreamClient = client;
    }
}
exports.default = PassthroughTable;
//# sourceMappingURL=PassthroughTable.js.map