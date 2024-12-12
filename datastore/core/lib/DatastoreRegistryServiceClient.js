"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ulixee/commons/lib/utils");
class DatastoreRegistryServiceClient {
    constructor(client) {
        this.client = client;
        this.source = 'cluster';
        this.hostAddress = (0, utils_1.toUrl)(client.transport.host);
    }
    async close() {
        return Promise.resolve();
    }
    async list(count, offset) {
        const result = await this.client.sendRequest({
            command: 'DatastoreRegistry.list',
            args: [{ count, offset }],
        });
        return {
            datastores: result.datastores,
            total: result.total,
        };
    }
    async getVersions(id) {
        const result = await this.client.sendRequest({
            command: 'DatastoreRegistry.getVersions',
            args: [{ id }],
        });
        return result.versions;
    }
    async get(id, version) {
        const result = await this.client.sendRequest({
            command: 'DatastoreRegistry.get',
            args: [{ id, version }],
        });
        return result.datastore;
    }
    async getLatestVersion(id) {
        return (await this.client.sendRequest({
            command: 'DatastoreRegistry.getLatestVersion',
            args: [{ id }],
        }))?.latestVersion;
    }
    async downloadDbx(id, version) {
        const { adminIdentity, adminSignature, compressedDbx } = await this.client.sendRequest({
            command: 'DatastoreRegistry.downloadDbx',
            args: [{ id, version }],
        });
        return {
            compressedDbx,
            adminIdentity,
            adminSignature,
            apiHost: this.client.transport.host,
        };
    }
    async upload(datastore) {
        return await this.client.sendRequest({
            command: 'DatastoreRegistry.upload',
            args: [datastore],
        });
    }
}
exports.default = DatastoreRegistryServiceClient;
//# sourceMappingURL=DatastoreRegistryServiceClient.js.map