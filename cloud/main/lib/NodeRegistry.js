"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRegistryServiceClient_1 = require("./NodeRegistryServiceClient");
class NodeRegistry {
    constructor(config) {
        this.config = config;
        const { nodeTracker, serviceClient } = config;
        this.nodeTracker = nodeTracker;
        if (serviceClient) {
            this.serviceClient = new NodeRegistryServiceClient_1.default(serviceClient, this.config.datastoreCore, this.config.heroCore, () => ({
                clients: this.config.publicServer.connections,
            }));
        }
    }
    async close() {
        await this.serviceClient?.close();
        // clear out memory
        this.config = null;
        this.serviceClient = null;
    }
    async register(identity) {
        this.nodeMeta = {
            nodeId: identity?.bech32,
            apiHost: await this.config.publicServer.host,
            isClusterNode: true,
            lastSeenDate: new Date(),
        };
        this.nodeTracker.track(this.nodeMeta);
        if (this.serviceClient) {
            if (!identity)
                throw new Error('You must configure a network identity (ULX_NETWORK_IDENTITY_PATH) to use the node registry service.');
            const { nodes } = await this.serviceClient.register(this.nodeMeta);
            for (const node of nodes) {
                this.nodeTracker.track(node);
            }
        }
    }
    async getNodes(count = 25) {
        if (this.nodeTracker.nodes.length < count && this.serviceClient) {
            const clusterNodes = await this.serviceClient.getNodes(count);
            for (const node of clusterNodes.nodes) {
                this.nodeTracker.track(node);
            }
        }
        return this.nodeTracker.nodes.slice(0, count);
    }
}
exports.default = NodeRegistry;
//# sourceMappingURL=NodeRegistry.js.map