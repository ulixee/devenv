"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreditsTable_1 = require("@ulixee/datastore/lib/CreditsTable");
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.creditsBalance', {
    async handler(request, context) {
        const datastoreVersion = await context.datastoreRegistry.get(request.id, request.version);
        const storage = context.storageEngineRegistry.get(datastoreVersion, {
            id: request.id,
            version: request.version,
            queryId: context.connectionToClient?.transport.remoteId ?? 'creditsBalance',
        });
        const datastore = await context.vm.open(datastoreVersion.runtimePath, storage, datastoreVersion);
        const credits = await datastore.tables[CreditsTable_1.default.tableName].get(request.creditId);
        return {
            balance: credits?.remainingCredits ?? 0n,
            issuedCredits: credits?.issuedCredits ?? 0n,
        };
    },
});
//# sourceMappingURL=Datastore.creditsBalance.js.map