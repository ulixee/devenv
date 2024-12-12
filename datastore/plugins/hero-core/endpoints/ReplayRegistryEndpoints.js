"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HostedServicesEndpoints_1 = require("@ulixee/datastore-core/endpoints/HostedServicesEndpoints");
const ReplayRegistryApis_1 = require("@ulixee/platform-specification/services/ReplayRegistryApis");
class ReplayRegistryEndpoints {
    constructor() {
        this.handlersByCommand = {
            'ReplayRegistry.store': async ({ sessionId, db }, ctx) => {
                await ctx.replayRegistry.replayStorageRegistry.store(sessionId, db);
                return { success: true };
            },
            'ReplayRegistry.delete': async ({ sessionId }, ctx) => {
                return await ctx.replayRegistry.replayStorageRegistry.delete(sessionId);
            },
            'ReplayRegistry.get': async ({ sessionId }, ctx) => {
                const result = await ctx.replayRegistry.replayStorageRegistry.get(sessionId);
                if (result)
                    return { db: await result.db };
                return null;
            },
            'ReplayRegistry.ids': async (_, ctx) => {
                const results = await ctx.replayRegistry.ids();
                return { sessionIds: results };
            },
        };
        for (const [api, handler] of Object.entries(this.handlersByCommand)) {
            const validationSchema = ReplayRegistryApis_1.ReplayRegistryApiSchemas[api];
            this.handlersByCommand[api] = HostedServicesEndpoints_1.validateThenRun.bind(this, api, handler.bind(this), validationSchema);
        }
    }
    attachToConnection(connection, context) {
        Object.assign(connection.apiHandlers, this.handlersByCommand);
        Object.assign(connection.handlerMetadata, context);
        return connection;
    }
}
exports.default = ReplayRegistryEndpoints;
//# sourceMappingURL=ReplayRegistryEndpoints.js.map