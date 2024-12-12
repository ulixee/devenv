"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
const translateDatastoreMetadata_1 = require("../lib/translateDatastoreMetadata");
exports.default = new DatastoreApiHandler_1.default('Datastore.meta', {
    async handler(request, context) {
        const datastore = await context.datastoreRegistry.get(request.id, request.version);
        const stats = await context.statsTracker.getForDatastoreVersion(datastore);
        const paymentInfo = await context.argonPaymentProcessor?.getPaymentInfo();
        return (0, translateDatastoreMetadata_1.default)(datastore, stats, request.includeSchemasAsJson, paymentInfo);
    },
});
//# sourceMappingURL=Datastore.meta.js.map