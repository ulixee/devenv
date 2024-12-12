"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const hero_core_1 = require("@ulixee/hero-core");
const MINUTE = 60e3;
class NodeRegistryServiceClient {
    get stats() {
        return this.statsBuckets[this.statsBuckets.length - 1];
    }
    constructor(connectionToCore, datastoreCore, heroCore, getConnections) {
        this.heroCore = heroCore;
        this.getConnections = getConnections;
        this.eventSubscriber = new EventSubscriber_1.default();
        this.statsBuckets = [];
        this.client = connectionToCore;
        this.heartbeatInternal = setInterval(this.heartbeat.bind(this), 5 * MINUTE);
        this.eventSubscriber.on(hero_core_1.default.events, 'agent-created', () => (this.stats.sessions += 1));
        this.eventSubscriber.on(datastoreCore, 'connection', () => (this.stats.clients += 1));
        this.eventSubscriber.on(datastoreCore, 'query', () => (this.stats.queries += 1));
        this.statsBuckets.push({ sessions: 0, queries: 0, clients: 0, startDate: new Date() });
    }
    async close() {
        // clear loop
        this.getConnections = null;
        clearInterval(this.heartbeatInternal);
        this.eventSubscriber.close();
        await this.client.disconnect();
        this.heroCore = null;
    }
    async getNodes(count) {
        if (!this.shouldReloadNodes())
            return { nodes: [] };
        this.lastClusterCheckTimestamp = Date.now();
        return await this.client.sendRequest({
            command: 'NodeRegistry.getNodes',
            args: [{ count }],
        });
    }
    async register(details) {
        this.nodeId = details.nodeId;
        return await this.client.sendRequest({
            command: 'NodeRegistry.register',
            args: [details],
        });
    }
    async sendHealth(details) {
        return await this.client.sendRequest({
            command: 'NodeRegistry.health',
            args: [details],
        });
    }
    async heartbeat() {
        const stats = this.stats;
        this.statsBuckets.push({ sessions: 0, queries: 0, clients: 0, startDate: new Date() });
        const connections = this.getConnections();
        await this.sendHealth({
            nodeId: this.nodeId,
            clientConnections: connections.clients,
            coreMetrics: {
                periodStartTime: stats.startDate,
                heroPoolSize: this.heroCore.pool.maxConcurrentAgents,
                heroPoolAvailable: this.heroCore.pool.maxConcurrentAgents - this.heroCore.pool.activeAgentsCount,
                datastoreQueries: stats.queries,
                heroSessions: stats.sessions,
            },
        });
    }
    shouldReloadNodes() {
        if (!this.lastClusterCheckTimestamp)
            return true;
        const elapsedMinutes = Date.now() - this.lastClusterCheckTimestamp;
        return elapsedMinutes >= 10 * MINUTE;
    }
}
exports.default = NodeRegistryServiceClient;
//# sourceMappingURL=NodeRegistryServiceClient.js.map