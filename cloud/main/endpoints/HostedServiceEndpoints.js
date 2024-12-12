"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRegistryApis_1 = require("@ulixee/platform-specification/services/NodeRegistryApis");
const SetupApis_1 = require("@ulixee/platform-specification/services/SetupApis");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
class HostedServiceEndpoints {
    constructor() {
        this.handlersByCommand = {
            'Services.getSetup': async (_, ctx) => {
                const { datastoreRegistryHost, storageEngineHost, statsTrackerHost, replayRegistryHost } = ctx.datastoreConfiguration;
                const { nodeRegistryHost } = ctx.cloudConfiguration;
                return Promise.resolve({
                    storageEngineHost,
                    datastoreRegistryHost,
                    nodeRegistryHost,
                    statsTrackerHost,
                    replayRegistryHost,
                });
            },
            'NodeRegistry.getNodes': async ({ count }, ctx) => {
                const nodes = await ctx.nodeRegistry.getNodes(count);
                return { nodes };
            },
            'NodeRegistry.register': async (registration, ctx) => {
                return await ctx.nodeTracker.track({
                    ...registration,
                    lastSeenDate: new Date(),
                    isClusterNode: true,
                });
            },
            'NodeRegistry.health': async (health, ctx) => {
                await ctx.nodeTracker.checkin(health);
                return { success: true };
            },
        };
        for (const [api, handler] of Object.entries(this.handlersByCommand)) {
            const validationSchema = NodeRegistryApis_1.NodeRegistryApiSchemas[api] ?? SetupApis_1.ServicesSetupApiSchemas[api];
            this.handlersByCommand[api] = validateThenRun.bind(this, api, handler.bind(this), validationSchema);
        }
    }
    attachToConnection(connection, context) {
        Object.assign(connection.apiHandlers, this.handlersByCommand);
        Object.assign(connection.handlerMetadata, context);
        return connection;
    }
}
exports.default = HostedServiceEndpoints;
function validateThenRun(api, handler, validationSchema, args, context) {
    if (!validationSchema)
        return handler(args, context);
    // NOTE: mutates `errors`
    const result = validationSchema.args.safeParse(args);
    if (result.success === true)
        return handler(result.data, context);
    throw ValidationError_1.default.fromZodValidation(`The parameters for this command (${api}) are invalid.`, result.error);
}
//# sourceMappingURL=HostedServiceEndpoints.js.map