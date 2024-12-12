"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.stats', {
    async handler(request, context) {
        const datastore = await context.datastoreRegistry.get(request.id);
        const datastoreStats = await context.statsTracker.getForDatastore(datastore);
        const versionStats = await context.statsTracker.getForDatastoreVersion(datastore);
        return {
            byVersion: Object.values(versionStats.statsByEntityName),
            overall: Object.values(datastoreStats.statsByEntityName),
        };
    },
});
//# sourceMappingURL=Datastore.stats.js.map