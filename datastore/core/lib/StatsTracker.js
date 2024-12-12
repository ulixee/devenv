"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const StatsTrackerDiskStore_1 = require("./StatsTrackerDiskStore");
const StatsTrackerServiceClient_1 = require("./StatsTrackerServiceClient");
class StatsTracker extends TypedEventEmitter_1.default {
    constructor(datastoresDir, connectionToServiceCore) {
        super();
        this.datastoresDir = datastoresDir;
        if (connectionToServiceCore) {
            this.serviceClient = new StatsTrackerServiceClient_1.default(connectionToServiceCore);
        }
        else {
            this.diskStore = new StatsTrackerDiskStore_1.default(datastoresDir);
            this.diskStore.addEventEmitter(this, ['stats']);
        }
    }
    async close() {
        await this.diskStore?.close();
    }
    async getForDatastoreVersion(manifest) {
        if (this.serviceClient)
            return this.serviceClient.getForDatastoreVersion(manifest.id, manifest.version);
        return this.diskStore.getForDatastoreVersion(manifest);
    }
    async getForDatastore(manifest) {
        if (this.serviceClient)
            return this.serviceClient.getForDatastore(manifest.id);
        return this.diskStore.getForDatastore(manifest);
    }
    async getSummary(datastoreId) {
        if (this.serviceClient)
            return this.serviceClient.getDatastoreSummary(datastoreId);
        return this.diskStore.getDatastoreSummary(datastoreId);
    }
    async recordEntityStats(details) {
        if (this.serviceClient)
            await this.serviceClient.recordEntityStats(details);
        else
            this.diskStore.recordEntityStats(details);
    }
    async recordQuery(details) {
        this.emit('query', { datastoreId: details.datastoreId, version: details.version });
        if (this.serviceClient)
            await this.serviceClient.recordQuery(details);
        else
            this.diskStore.recordQuery(details);
    }
}
exports.default = StatsTracker;
//# sourceMappingURL=StatsTracker.js.map