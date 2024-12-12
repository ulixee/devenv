"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("@ulixee/net");
const addGlobalInstance_1 = require("@ulixee/commons/lib/addGlobalInstance");
class ConnectionToDatastoreCore extends net_1.ConnectionToCore {
    constructor(transport, options) {
        super(transport);
        this.options = options ?? {};
    }
    static remote(host) {
        const transport = new net_1.WsTransportToCore(`${host}/datastore`);
        return new ConnectionToDatastoreCore(transport);
    }
}
exports.default = ConnectionToDatastoreCore;
(0, addGlobalInstance_1.default)(ConnectionToDatastoreCore);
//# sourceMappingURL=ConnectionToDatastoreCore.js.map