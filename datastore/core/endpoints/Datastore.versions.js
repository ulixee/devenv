"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.versions', {
    async handler(request, context) {
        const versions = await context.datastoreRegistry.getVersions(request.id);
        return { versions };
    },
});
//# sourceMappingURL=Datastore.versions.js.map