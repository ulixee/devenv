"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastores.list', {
    async handler(request, context) {
        const results = [];
        const { datastores, total } = await context.datastoreRegistry.list(100, request.offset);
        for (const datastore of datastores) {
            const stats = await context.statsTracker.getSummary(datastore.id);
            results.push({
                version: datastore.version,
                versionTimestamp: datastore.versionTimestamp,
                id: datastore.id,
                description: datastore.description,
                domain: datastore.domain,
                isStarted: datastore.isStarted,
                scriptEntrypoint: datastore.scriptEntrypoint,
                name: datastore.name,
                stats: stats.stats,
            });
        }
        return { datastores: results, total, offset: request.offset };
    },
});
//# sourceMappingURL=Datastores.list.js.map