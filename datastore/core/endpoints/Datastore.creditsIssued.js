"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreditsTable_1 = require("@ulixee/datastore/lib/CreditsTable");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.creditsIssued', {
    async handler(request, context) {
        const datastoreVersion = await context.datastoreRegistry.get(request.id, request.version);
        const storage = context.storageEngineRegistry.get(datastoreVersion, {
            id: request.id,
            version: request.version,
            queryId: context.connectionToClient?.transport.remoteId ?? 'creditsIssued',
        });
        const datastore = await context.vm.open(datastoreVersion.runtimePath, storage, datastoreVersion);
        const { count, microgons } = await datastore.tables[CreditsTable_1.default.tableName].summary();
        return { count, issuedCredits: microgons ?? 0n };
    },
});
//# sourceMappingURL=Datastore.creditsIssued.js.map