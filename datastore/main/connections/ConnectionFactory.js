"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosts_1 = require("@ulixee/commons/config/hosts");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const ShutdownHandler_1 = require("@ulixee/commons/lib/ShutdownHandler");
const net_1 = require("@ulixee/net");
const ConnectionToDatastoreCore_1 = require("./ConnectionToDatastoreCore");
const { version } = require('../package.json');
const { log } = (0, Logger_1.default)(module);
class ConnectionFactory {
    static createConnection() {
        let connection;
        const host = hosts_1.default.global.getVersionHost(version);
        if (host) {
            const transport = new net_1.WsTransportToCore(`${host}/datastore`);
            connection = new ConnectionToDatastoreCore_1.default(transport, { version });
        }
        else if (hosts_1.default.global.hasHosts()) {
            if (this.hasLocalCloudPackage) {
                // If Clouds are launched, but none compatible, propose installing Ulixee Cloud locally
                throw new Error(`A local Ulixee Cloud is not started. From your project, run:\n\nnpx @ulixee/cloud start`);
            }
            // If Clouds are launched, but none compatible, propose installing cloudNode locally
            throw new Error(`Your script is using version ${version} of Datastore. A compatible Datastore Core was not found on localhost. You can fix this by installing and running a local Ulixee Cloud in your project:

npm install --save-dev @ulixee/cloud

npx @ulixee/cloud start
      `);
        }
        if (!connection) {
            throw new Error('Datastore Core could not be found locally\nIf you meant to connect to a remote host, include the "host" parameter for your connection');
        }
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const onError = (error) => {
            if (error) {
                log.error('Error connecting to core', {
                    error,
                    sessionId: null,
                });
            }
        };
        connection.connect({ isAutoConnect: true }).catch(onError);
        const closeFn = () => connection.disconnect();
        ShutdownHandler_1.default.register(closeFn);
        connection.once('disconnected', () => ShutdownHandler_1.default.unregister(closeFn));
        return connection;
    }
}
ConnectionFactory.hasLocalCloudPackage = false;
exports.default = ConnectionFactory;
try {
    require.resolve('@ulixee/cloud');
    ConnectionFactory.hasLocalCloudPackage = true;
}
catch (error) {
    /* no-op */
}
//# sourceMappingURL=ConnectionFactory.js.map