"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("@ulixee/hero");
const TransportBridge_1 = require("@ulixee/net/lib/TransportBridge");
const nanoid_1 = require("nanoid");
const Path = require("path");
const ReplayRegistryEndpoints_1 = require("./endpoints/ReplayRegistryEndpoints");
const ReplayRegistry_1 = require("./lib/ReplayRegistry");
const pkg = require('@ulixee/datastore-plugins-hero/package.json');
class DatastoreForHeroPluginCore {
    constructor() {
        this.name = pkg.name;
        this.version = pkg.version;
        this.nodeVmRequireWhitelist = [
            '@ulixee/hero',
            '@ulixee/unblocked-agent',
            '@ulixee/unblocked-specification',
            '@ulixee/awaited-dom',
            '@ulixee/execute-js-plugin',
            '@ulixee/datastore-plugins-hero',
        ];
        this.nodeVmSandboxList = [
            '@ulixee/hero',
            '@ulixee/awaited-dom',
            '@ulixee/execute-js-plugin/index',
            '@ulixee/execute-js-plugin/lib/ClientPlugin',
            '@ulixee/datastore-plugins-hero',
            'TypedEventEmitter',
            'eventUtils',
        ];
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async onCoreStart(coreConfigureOptions, options) {
        const heroCore = options.getSystemCore('heroCore');
        if (!heroCore) {
            throw new Error('Could not find a heroCore instance to attach to!!');
        }
        this.replayRegistry = new ReplayRegistry_1.default({
            queryHeroStorageDir: coreConfigureOptions.queryHeroSessionsDir,
            defaultHeroStorageDir: Path.join(heroCore.dataDir, 'hero-sessions'),
            serviceClient: options.createConnectionToServiceHost(coreConfigureOptions.replayRegistryHost),
        });
        heroCore.sessionRegistry = this.replayRegistry;
        this.endpoints = new ReplayRegistryEndpoints_1.default();
        if (process.platform === 'win32') {
            this.nodeVmSandboxList = this.nodeVmSandboxList.map(x => x.replace(/\//g, '\\'));
        }
        const bridge = new TransportBridge_1.default();
        heroCore.addConnection(bridge.transportToClient);
        this.connectionToCore = new hero_1.ConnectionToHeroCore(bridge.transportToCore);
    }
    beforeRunExtractor(options, runtime) {
        options.scriptInvocationMeta = {
            version: options.version,
            productId: options.id,
            runId: options.queryId,
            entrypoint: runtime.scriptEntrypoint,
            entryFunction: runtime.functionName,
            runtime: 'datastore',
        };
        options.sessionId = `query-${options.queryId}-${(0, nanoid_1.nanoid)(3)}`;
        options.connectionToCore = this.connectionToCore;
    }
    async afterRunExtractor(_options, _output, cacheUpdates) {
        if (!cacheUpdates)
            return;
        const actions = [];
        for (const [sessionId, { action, crawler }] of Object.entries(cacheUpdates)) {
            if (crawler !== 'Hero')
                continue;
            if (action === 'evicted') {
                actions.push(this.replayRegistry.delete(sessionId));
            }
            if (action === 'cached') {
                actions.push(this.replayRegistry.store(sessionId));
            }
        }
        await Promise.allSettled(actions);
    }
    registerHostedServices(connectionToClient) {
        this.endpoints?.attachToConnection(connectionToClient, { replayRegistry: this.replayRegistry });
    }
    async onCoreClose() {
        await this.replayRegistry?.shutdown();
        await this.connectionToCore?.disconnect();
    }
}
exports.default = DatastoreForHeroPluginCore;
//# sourceMappingURL=index.js.map