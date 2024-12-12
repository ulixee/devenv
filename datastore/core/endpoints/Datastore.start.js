"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatastoreApiHandler_1 = require("../lib/DatastoreApiHandler");
exports.default = new DatastoreApiHandler_1.default('Datastore.start', {
    async handler(request, context) {
        if (!context.configuration.enableDatastoreWatchMode) {
            throw new Error('Datastore development/watch mode is not activated.');
        }
        const { dbxPath } = request;
        const { datastoreRegistry } = context;
        await datastoreRegistry.startAtPath(dbxPath, context.connectionToClient?.transport.remoteId, request.watch);
        context.connectionToClient.once('disconnected', () => datastoreRegistry.stopAtPath(dbxPath));
        return { success: true };
    },
});
//# sourceMappingURL=Datastore.start.js.map