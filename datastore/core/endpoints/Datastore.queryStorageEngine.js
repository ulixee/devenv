"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PricingManager_1 = require("@ulixee/datastore/lib/PricingManager");
const sql_engine_1 = require("@ulixee/sql-engine");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const datastoreUtils_1 = require("../lib/datastoreUtils");
const PaymentsProcessor_1 = require("../lib/PaymentsProcessor");
exports.default = new DatastoreApiHandler_1.default('Datastore.queryStorageEngine', {
    async handler(request, context) {
        request.boundValues ??= [];
        const { id, payment, authentication, version, queryId } = request;
        const startTime = Date.now();
        const manifestWithEntrypoint = await context.datastoreRegistry.get(id, version);
        const storage = context.storageEngineRegistry.get(manifestWithEntrypoint, {
            id,
            version,
            payment,
            authentication,
            queryId,
        });
        const datastore = await context.vm.open(manifestWithEntrypoint.runtimePath, storage, manifestWithEntrypoint);
        await (0, datastoreUtils_1.validateAuthentication)(datastore, payment, authentication);
        const sqlParser = new sql_engine_1.SqlParser(request.sql);
        const paymentsProcessor = new PaymentsProcessor_1.default(payment, id, datastore, context);
        const tableCalls = sqlParser
            .extractTableCalls()
            .filter(x => !request.virtualEntitiesByName?.[x]);
        await paymentsProcessor.debit(queryId, manifestWithEntrypoint, tableCalls);
        const finalResult = {
            outputs: null,
            latestVersion: manifestWithEntrypoint.latestVersion,
            metadata: {
                bytes: 0,
                microgons: 0n,
                milliseconds: 0,
            },
            runError: null,
        };
        try {
            let upstreamMeta;
            finalResult.outputs = await storage.query(sqlParser, request.boundValues, {
                id,
                version,
                payment,
                authentication,
                queryId,
                onQueryResult: result => {
                    upstreamMeta = result.metadata;
                },
            }, request.virtualEntitiesByName);
            let basePrice = 0n;
            for (const call of tableCalls) {
                const price = BigInt(manifestWithEntrypoint.tablesByName[call]?.prices?.[0]?.basePrice ?? 0);
                basePrice += price;
            }
            paymentsProcessor.trackCallResult('query', basePrice, upstreamMeta);
            const bytes = PricingManager_1.default.getOfficialBytes(finalResult.outputs);
            finalResult.metadata.microgons = await paymentsProcessor.finalize(bytes);
            finalResult.metadata.bytes = bytes;
        }
        catch (error) {
            finalResult.runError = error;
        }
        finalResult.metadata.milliseconds = Date.now() - startTime;
        return finalResult;
    },
});
//# sourceMappingURL=Datastore.queryStorageEngine.js.map