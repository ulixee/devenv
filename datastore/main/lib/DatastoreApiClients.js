"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@ulixee/commons/lib/utils");
const DatastoreApiClient_1 = require("./DatastoreApiClient");
/**
 * This is a cache of all the connections to other machines that we keep
 * alive since many connections use repeated access
 */
class DatastoreApiClients {
    constructor() {
        this.apiClientCacheByUrl = {};
    }
    async close() {
        for (const client of Object.values(this.apiClientCacheByUrl)) {
            await client.disconnect();
        }
        this.apiClientCacheByUrl = {};
    }
    get(host) {
        const url = (0, utils_1.toUrl)(host);
        host = `ulx://${url.host}`;
        if (!this.apiClientCacheByUrl[host]) {
            const client = new DatastoreApiClient_1.default(host);
            this.apiClientCacheByUrl[host] = client;
            client.connectionToCore.once('disconnected', () => {
                if (this.apiClientCacheByUrl[host] === client) {
                    delete this.apiClientCacheByUrl[host];
                }
            });
        }
        return this.apiClientCacheByUrl[host];
    }
}
exports.default = DatastoreApiClients;
//# sourceMappingURL=DatastoreApiClients.js.map