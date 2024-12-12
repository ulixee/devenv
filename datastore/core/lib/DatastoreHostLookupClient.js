"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatastoreHostLookupClient {
    constructor(serviceClient) {
        this.serviceClient = serviceClient;
    }
    async getHostInfo(datastoreUrl) {
        return this.serviceClient.sendRequest({
            command: 'DomainLookup.query',
            args: [{ datastoreUrl }],
        });
    }
}
exports.default = DatastoreHostLookupClient;
//# sourceMappingURL=DatastoreHostLookupClient.js.map