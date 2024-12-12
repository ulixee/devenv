"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThenRun = validateThenRun;
const ConnectionToClient_1 = require("@ulixee/net/lib/ConnectionToClient");
const DomainLookupApis_1 = require("@ulixee/platform-specification/datastore/DomainLookupApis");
const PaymentServiceApis_1 = require("@ulixee/platform-specification/datastore/PaymentServiceApis");
const ArgonPaymentProcessorApis_1 = require("@ulixee/platform-specification/services/ArgonPaymentProcessorApis");
const DatastoreRegistryApis_1 = require("@ulixee/platform-specification/services/DatastoreRegistryApis");
const StatsTrackerApis_1 = require("@ulixee/platform-specification/services/StatsTrackerApis");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
const errors_1 = require("../lib/errors");
class HostedServicesEndpoints {
    constructor() {
        this.connections = new Set();
        this.handlersByCommand = {
            'DatastoreRegistry.downloadDbx': async ({ id, version }, ctx) => {
                // only get from local if installed
                const result = await ctx.datastoreRegistry.diskStore.getCompressedDbx(id, version);
                if (!result) {
                    throw new errors_1.DatastoreNotFoundError('Datastore could not be download. Not found locally.', {
                        version,
                    });
                }
                return result;
            },
            'DatastoreRegistry.get': async ({ id, version }, ctx) => {
                const datastore = await ctx.datastoreRegistry.get(id, version, false);
                return { datastore };
            },
            'DatastoreRegistry.getLatestVersion': async ({ id }, ctx) => {
                const latestVersion = await ctx.datastoreRegistry.getLatestVersion(id);
                return { latestVersion };
            },
            'DatastoreRegistry.getVersions': async ({ id }, ctx) => {
                const versions = await ctx.datastoreRegistry.getVersions(id);
                return { versions };
            },
            'DatastoreRegistry.list': async ({ count, offset }, ctx) => {
                // don't go out to network
                return await ctx.datastoreRegistry.diskStore.list(count, offset);
            },
            'DatastoreRegistry.upload': async (request, ctx) => {
                const { datastoreRegistry, workTracker } = ctx;
                const result = await workTracker.trackUpload(datastoreRegistry.saveDbx(request, ctx.connectionToClient?.transport.remoteId));
                return { success: result?.didInstall ?? false };
            },
            'StatsTracker.recordEntityStats': async (args, ctx) => {
                await ctx.statsTracker.recordEntityStats(args);
                return { success: true };
            },
            'StatsTracker.recordQuery': async (args, ctx) => {
                await ctx.statsTracker.recordQuery(args);
                return { success: true };
            },
            'StatsTracker.get': async ({ datastoreId }, ctx) => {
                const manifest = await ctx.datastoreRegistry.get(datastoreId);
                return await ctx.statsTracker.getForDatastore(manifest);
            },
            'StatsTracker.getSummary': async ({ datastoreId }, ctx) => {
                return await ctx.statsTracker.getSummary(datastoreId);
            },
            'StatsTracker.getByVersion': async ({ datastoreId, version }, ctx) => {
                const manifest = await ctx.datastoreRegistry.get(datastoreId, version);
                return await ctx.statsTracker.getForDatastoreVersion(manifest);
            },
            'ArgonPaymentProcessor.getPaymentInfo': async (_args, ctx) => {
                return await ctx.argonPaymentProcessor.getPaymentInfo();
            },
            'ArgonPaymentProcessor.importChannelHold': async ({ channelHold, datastoreId }, ctx) => {
                const manifest = await ctx.datastoreRegistry.get(datastoreId);
                return await ctx.argonPaymentProcessor.importChannelHold({ channelHold, datastoreId }, manifest);
            },
            'ArgonPaymentProcessor.debit': async (data, ctx) => {
                return await ctx.argonPaymentProcessor.debit(data);
            },
            'ArgonPaymentProcessor.finalize': async (data, ctx) => {
                return await ctx.argonPaymentProcessor.finalize(data);
            },
            // upstream payments
            'PaymentService.authenticate': async (_args, _ctx) => {
                throw new Error('Not implemented');
            },
            'PaymentService.reserve': async (data, ctx) => {
                return await ctx.upstreamDatastorePaymentService.reserve(data);
            },
            'PaymentService.finalize': async (data, ctx) => {
                return await ctx.upstreamDatastorePaymentService.finalize(data);
            },
            'DomainLookup.query': async (args, ctx) => {
                return await ctx.datastoreLookup.getHostInfo(args.datastoreUrl);
            },
        };
        for (const [api, handler] of Object.entries(this.handlersByCommand)) {
            const validationSchema = DatastoreRegistryApis_1.DatastoreRegistryApiSchemas[api] ??
                StatsTrackerApis_1.StatsTrackerApiSchemas[api] ??
                PaymentServiceApis_1.PaymentServiceApisSchema[api] ??
                ArgonPaymentProcessorApis_1.ArgonPaymentProcessorApiSchema[api] ??
                DomainLookupApis_1.DomainLookupApiSchema[api];
            if (!validationSchema)
                throw new Error(`invalid api ${api}`);
            this.handlersByCommand[api] = validateThenRun.bind(this, api, handler.bind(this), validationSchema);
        }
    }
    addConnection(transport, context) {
        const connection = new ConnectionToClient_1.default(transport, this.handlersByCommand);
        connection.handlerMetadata = context;
        this.connections.add(connection);
        return connection;
    }
}
exports.default = HostedServicesEndpoints;
function validateThenRun(api, handler, validationSchema, args, context) {
    if (!validationSchema)
        return handler(args, context);
    // NOTE: mutates `errors`
    const result = validationSchema.args.safeParse(args);
    if (result.success === true)
        return handler(result.data, context);
    throw ValidationError_1.default.fromZodValidation(`The parameters for this command (${api}) are invalid.`, result.error);
}
//# sourceMappingURL=HostedServicesEndpoints.js.map