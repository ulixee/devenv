"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRouting = void 0;
const Logger_1 = require("@ulixee/commons/lib/Logger");
const { log } = (0, Logger_1.default)(module);
class ContentRouting {
    constructor(kad) {
        this.kad = kad;
        this.logger = log.createChild(module, {});
        this.network = kad.network;
        this.peerRouting = kad.peerRouting;
        this.queryManager = kad.queryManager;
        this.routingTable = kad.routingTable;
        this.providers = kad.providers;
    }
    /**
     * Announce to the network that we can provide the value for a given key and
     * are contactable on the given multiaddrs
     */
    async *provide(key, options = {}) {
        this.logger.info('ContentRouting.provide', { key });
        // Add self as provider
        await this.providers.addProvider(key, this.kad.nodeInfo.nodeId);
        let sent = 0;
        const resultIterator = this.queryManager.runOnClosestPeers(key, async ({ nodeInfo, signal }) => {
            const nodeId = nodeInfo.nodeId;
            const parentLogId = this.logger.info('ContentRouting.provide', { key, nodeId });
            try {
                const result = await this.network.sendRequest(nodeInfo, 'Kad.provide', { key }, { signal });
                this.logger.stats('ContentRouting.provided', { key, nodeId, parentLogId, sent });
                sent++;
                return result;
            }
            catch (error) {
                this.logger.error('ContentRouting.provideError', { nodeId, error, parentLogId, sent });
            }
        }, options);
        for await (const result of resultIterator) {
            if (result.error) {
                this.logger.info('Error in provide for node', result);
                continue;
            }
            yield { notifiedPeer: result.fromNodeId };
        }
    }
    /**
     * Search the dht for up to `K` providers of the given CID.
     */
    async *findProviders(key, options) {
        const toFind = this.routingTable.kBucketSize;
        const parentLogId = this.logger.info('ContentRouting.findProviders:start', { key });
        const providerNodeIds = this.providers.getProviders(key);
        // yield values if we have some, also slice because maybe we got lucky and already have too many?
        if (providerNodeIds.length > 0) {
            const providers = [];
            for (const nodeId of providerNodeIds.slice(0, toFind)) {
                const nodeInfo = this.kad.peerStore.get(nodeId);
                if (nodeInfo)
                    providers.push(nodeInfo);
            }
            this.logger.stats('ContentRouting.findProviders(local)', {
                parentLogId,
                providers: providers.length,
                key,
            });
            yield { fromNodeId: this.kad.nodeInfo.nodeId, providers };
        }
        // All done
        if (providerNodeIds.length >= toFind) {
            return;
        }
        const providers = new Set(providerNodeIds);
        const closerPeers = new Set();
        for await (const result of this.queryManager.runOnClosestPeers(key, ({ nodeInfo, signal }) => {
            return this.network.sendRequest(nodeInfo, 'Kad.findProviders', { key }, { signal });
        }, options)) {
            if (result.error) {
                this.logger.info('Error in findProviders for node', result);
                continue;
            }
            for (const peer of result.closerPeers)
                closerPeers.add(peer.nodeId);
            const newProviders = [];
            for (const nodeInfo of result.providerPeers) {
                if (providers.has(nodeInfo.nodeId) || nodeInfo.nodeId === this.kad.nodeId) {
                    continue;
                }
                providers.add(nodeInfo.nodeId);
                newProviders.push(nodeInfo);
            }
            if (newProviders.length > 0) {
                yield { fromNodeId: result.fromNodeId, providers: newProviders };
            }
            if (providers.size >= toFind) {
                break;
            }
        }
        this.logger.stats('ContentRouting.findProviders', {
            parentLogId,
            providers: providers.size,
            key,
            closerPeers: closerPeers.size,
        });
    }
}
exports.ContentRouting = ContentRouting;
//# sourceMappingURL=ContentRouting.js.map