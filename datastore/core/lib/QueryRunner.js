"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PricingManager_1 = require("@ulixee/datastore/lib/PricingManager");
const datastoreUtils_1 = require("./datastoreUtils");
const PaymentsProcessor_1 = require("./PaymentsProcessor");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const { log } = (0, Logger_1.default)(module);
class QueryRunner {
    get milliseconds() {
        return Date.now() - this.startTime;
    }
    get cloudNodeHost() {
        return this.context.cloudNodeAddress.host;
    }
    get cloudNodeIdentity() {
        return this.context.cloudNodeIdentity?.bech32;
    }
    constructor(context, queryDetails) {
        this.context = context;
        this.queryDetails = queryDetails;
        this.startTime = Date.now();
        this.heroSessionIds = new Set();
        this.microgons = 0;
        this.remoteQueryCounter = 0;
        this.localMachineTableCalls = [];
    }
    async openDatastore() {
        const { id, version, authentication, payment } = this.queryDetails;
        const manifestWithRuntime = await this.context.datastoreRegistry.get(id, version);
        this.datastoreManifest = manifestWithRuntime;
        const storage = this.context.storageEngineRegistry.get(manifestWithRuntime, this.queryDetails);
        this.storageEngine = storage;
        const datastore = await this.context.vm.open(manifestWithRuntime.runtimePath, storage, manifestWithRuntime);
        this.paymentsProcessor = new PaymentsProcessor_1.default(payment, id, datastore, this.context);
        await (0, datastoreUtils_1.validateAuthentication)(datastore, payment, authentication);
        return datastore;
    }
    async beforeAll(query, input, entityCalls) {
        try {
            await this.paymentsProcessor.debit(this.queryDetails.queryId, this.datastoreManifest, entityCalls);
            this.localMachineTableCalls = this.storageEngine.filterLocalTableCalls(entityCalls);
        }
        catch (error) {
            return this.finalize(query, input, error);
        }
    }
    beforeStorageEngine(options) {
        options = { ...options };
        options.onQueryResult = result => {
            this.storageEngineMetadata = result.metadata;
        };
        if (options.queryId)
            options.queryId += '.Q';
        return options;
    }
    async onPassthroughTable(name, options, run) {
        this.remoteQueryCounter += 1;
        options = { ...options };
        options.queryId += `.${this.remoteQueryCounter}`;
        let upstreamMeta;
        options.onQueryResult = result => {
            upstreamMeta = result?.metadata;
        };
        const pricing = this.getCallPricing(name);
        const result = await this.context.workTracker.trackRun(run(options));
        this.paymentsProcessor.trackCallResult(name, BigInt(pricing[0]?.basePrice ?? 0), upstreamMeta);
        return result;
    }
    async runFunction(name, options, run) {
        const { pluginCoresByName } = this.context;
        const runStart = Date.now();
        (0, datastoreUtils_1.validateFunctionCoreVersions)(this.datastoreManifest, name, this.context);
        options = { ...options, ...this.queryDetails };
        options.trackMetadata = (metaName, metaValue) => {
            if (metaName === 'heroSessionId') {
                this.heroSessionIds.add(metaValue);
            }
        };
        for (const plugin of Object.values(pluginCoresByName)) {
            if (plugin.beforeRunExtractor)
                await plugin.beforeRunExtractor(options, {
                    scriptEntrypoint: this.datastoreManifest.runtimePath,
                    functionName: name,
                });
        }
        let runError;
        let outputs;
        let bytes = 0;
        let microgons = 0n;
        const pricing = this.getCallPricing(name);
        let upstreamMeta;
        if (pricing[1]?.remoteMeta) {
            options.onQueryResult = result => {
                upstreamMeta = result?.metadata;
            };
            if (options.queryId) {
                this.remoteQueryCounter += 1;
                options.queryId += `.${this.remoteQueryCounter}`;
            }
        }
        const cacheOutputs = {};
        options.onCacheUpdated = (sessionId, crawler, action) => {
            cacheOutputs[sessionId] = { crawler, action };
        };
        try {
            outputs = await this.context.workTracker.trackRun(run(options));
            // release the hold
            bytes = PricingManager_1.default.getOfficialBytes(outputs);
            microgons = this.paymentsProcessor.trackCallResult(name, BigInt(pricing[0]?.basePrice) ?? 0n, upstreamMeta);
        }
        catch (error) {
            runError = error;
        }
        for (const plugin of Object.values(pluginCoresByName)) {
            if (plugin.afterRunExtractor)
                await plugin.afterRunExtractor(options, outputs, cacheOutputs, {
                    scriptEntrypoint: this.datastoreManifest.runtimePath,
                    functionName: name,
                });
        }
        await this.context.statsTracker.recordEntityStats({
            version: options.version,
            datastoreId: options.id,
            entityName: name,
            bytes,
            microgons,
            milliseconds: Date.now() - runStart,
            didUseCredits: !!this.queryDetails.payment?.credits,
            cloudNodeHost: this.cloudNodeHost,
            cloudNodeIdentity: this.cloudNodeIdentity,
            error: runError,
        });
        // Do we need to rollback the stats? We won't finalize payment in this scenario.
        if (runError)
            throw runError;
        return outputs;
    }
    async finalize(query, input, finalResult) {
        let outputs;
        let runError;
        let bytes = 0;
        if (finalResult instanceof Error) {
            runError = finalResult;
        }
        else {
            outputs = finalResult;
            bytes = PricingManager_1.default.getOfficialBytes(outputs);
        }
        if (this.storageEngineMetadata)
            this.paymentsProcessor.storageEngineResult(this.storageEngineMetadata);
        for (const tableCall of this.localMachineTableCalls) {
            const pricing = this.getCallPricing(tableCall) ?? [];
            const price = BigInt(pricing[0]?.basePrice ?? 0);
            this.paymentsProcessor.trackCallResult(tableCall, price);
        }
        let microgons = 0n;
        try {
            microgons = await this.paymentsProcessor.finalize(bytes);
        }
        catch (error) {
            if (!runError)
                runError = error;
            else {
                log.error('Error finalizing payment', { error, sessionId: this.queryDetails.queryId });
            }
        }
        const metadata = {
            bytes,
            microgons,
            milliseconds: Date.now() - this.startTime,
        };
        await this.recordQueryResult(query, input, outputs, metadata, runError);
        return {
            outputs,
            runError,
            latestVersion: this.datastoreManifest.latestVersion,
            metadata,
        };
    }
    recordQueryResult(query, input, outputs, metadata, runError) {
        const { id, version, queryId, payment, affiliateId } = this.queryDetails;
        return this.context.statsTracker.recordQuery({
            queryId,
            query,
            startTime: this.startTime,
            input,
            outputs,
            version,
            datastoreId: id,
            ...metadata,
            channelHoldId: payment?.channelHold?.id,
            creditId: payment?.credits?.id,
            affiliateId,
            error: runError,
            heroSessionIds: [...this.heroSessionIds],
            cloudNodeHost: this.cloudNodeHost,
            cloudNodeIdentity: this.cloudNodeIdentity,
        });
    }
    getCallPricing(name) {
        return (this.datastoreManifest.extractorsByName[name] ??
            this.datastoreManifest.crawlersByName[name] ??
            this.datastoreManifest.tablesByName[name]).prices;
    }
}
exports.default = QueryRunner;
//# sourceMappingURL=QueryRunner.js.map