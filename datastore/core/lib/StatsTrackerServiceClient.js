"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatsTrackerServiceClient {
    constructor(client) {
        this.client = client;
    }
    async close() {
        await this.client.disconnect();
    }
    async getForDatastoreVersion(datastoreId, version) {
        return await this.client.sendRequest({
            command: 'StatsTracker.getByVersion',
            args: [{ datastoreId, version }],
        });
    }
    async getForDatastore(datastoreId) {
        return await this.client.sendRequest({
            command: 'StatsTracker.get',
            args: [{ datastoreId }],
        });
    }
    async getDatastoreSummary(datastoreId) {
        return await this.client.sendRequest({
            command: 'StatsTracker.getSummary',
            args: [{ datastoreId }],
        });
    }
    async recordEntityStats(details) {
        await this.client.sendRequest({
            command: 'StatsTracker.recordEntityStats',
            args: [details],
        });
    }
    async recordQuery(details) {
        await this.client.sendRequest({
            command: 'StatsTracker.recordQuery',
            args: [details],
        });
    }
}
exports.default = StatsTrackerServiceClient;
//# sourceMappingURL=StatsTrackerServiceClient.js.map