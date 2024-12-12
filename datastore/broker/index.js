"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DataBroker_server, _DataBroker_adminServer, _DataBroker_whitelistDb, _DataBroker_db, _DataBroker_datastoreApiClients, _DataBroker_localchain, _DataBroker_isStarted;
Object.defineProperty(exports, "__esModule", { value: true });
require("@ulixee/commons/lib/SourceMapSupport");
const cloud_1 = require("@ulixee/cloud");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const ShutdownHandler_1 = require("@ulixee/commons/lib/ShutdownHandler");
const utils_1 = require("@ulixee/commons/lib/utils");
const staticServe_1 = require("@ulixee/platform-utils/lib/staticServe");
const DatastoreApiClients_1 = require("@ulixee/datastore/lib/DatastoreApiClients");
const LocalchainWithSync_1 = require("@ulixee/datastore/payments/LocalchainWithSync");
const net_1 = require("@ulixee/net");
const ApiRegistry_1 = require("@ulixee/net/lib/ApiRegistry");
const Path = require("node:path");
const db_1 = require("./db");
const DatastoreWhitelistDb_1 = require("./db/DatastoreWhitelistDb");
const AdminApiEndpoints_1 = require("./endpoints/AdminApiEndpoints");
const Databroker_createChannelHold_1 = require("./endpoints/Databroker.createChannelHold");
const Databroker_getBalance_1 = require("./endpoints/Databroker.getBalance");
const env_1 = require("./env");
const { log } = (0, Logger_1.default)(module);
const adminDist = Path.join(__dirname, 'admin-ui');
class DataBroker {
    get host() {
        return __classPrivateFieldGet(this, _DataBroker_server, "f").host;
    }
    get adminHost() {
        return __classPrivateFieldGet(this, _DataBroker_adminServer, "f").host;
    }
    constructor(configuration) {
        this.configuration = configuration;
        _DataBroker_server.set(this, void 0);
        _DataBroker_adminServer.set(this, void 0);
        _DataBroker_whitelistDb.set(this, void 0);
        _DataBroker_db.set(this, void 0);
        _DataBroker_datastoreApiClients.set(this, new DatastoreApiClients_1.default());
        _DataBroker_localchain.set(this, void 0);
        _DataBroker_isStarted.set(this, new Resolvable_1.default());
        this.apiRegistry = new ApiRegistry_1.default([
            Databroker_createChannelHold_1.default,
            Databroker_getBalance_1.default,
        ]);
        this.adminApis = new AdminApiEndpoints_1.default();
        __classPrivateFieldSet(this, _DataBroker_db, new db_1.default(configuration.storageDir), "f");
        __classPrivateFieldSet(this, _DataBroker_whitelistDb, new DatastoreWhitelistDb_1.default(configuration.storageDir), "f");
        __classPrivateFieldSet(this, _DataBroker_localchain, new LocalchainWithSync_1.default(configuration.localchainConfig), "f");
        __classPrivateFieldGet(this, _DataBroker_localchain, "f").on('sync', this.onLocalchainSync.bind(this));
        void __classPrivateFieldGet(this, _DataBroker_localchain, "f").load().then(() => __classPrivateFieldGet(this, _DataBroker_isStarted, "f").resolve(), __classPrivateFieldGet(this, _DataBroker_isStarted, "f").reject);
        this.apiRegistry.apiHandlerMetadataFn = (_apiRequest, _logger, remoteId) => this.getApiContext(remoteId);
        __classPrivateFieldSet(this, _DataBroker_server, new cloud_1.RoutableServer(__classPrivateFieldGet(this, _DataBroker_isStarted, "f").promise), "f");
        __classPrivateFieldGet(this, _DataBroker_server, "f").addHttpRoute(/(Databroker\..+)/, 'POST', this.apiRegistry.handleHttpRoute.bind(this.apiRegistry));
        __classPrivateFieldSet(this, _DataBroker_adminServer, new cloud_1.RoutableServer(__classPrivateFieldGet(this, _DataBroker_isStarted, "f").promise), "f");
        const fileServer = (0, staticServe_1.default)(adminDist, adminDist.includes('build/') ? 0 : 3600 * 24);
        __classPrivateFieldGet(this, _DataBroker_adminServer, "f").addHttpRoute(/.*/, 'GET', (req, res) => {
            // redirect non files back to index.html
            if (!Path.extname(req.url)) {
                req.url = '/';
            }
            void fileServer(req, res).catch(() => null);
        });
        __classPrivateFieldGet(this, _DataBroker_adminServer, "f").addWsRoute('/', (ws, req) => {
            const transport = new net_1.WsTransportToClient(ws, req);
            const context = this.getApiContext(transport.remoteId);
            const connection = this.adminApis.addConnection(transport, context);
            const logger = context.logger;
            connection.on('response', ({ response, request, metadata }) => {
                logger.info(`admin/${request.command} (${request.messageId})`, {
                    args: request.args?.[0],
                    response: response.data,
                    ...metadata,
                });
            });
        });
        ShutdownHandler_1.default.register(this.close.bind(this));
    }
    async close() {
        log.info('DataBroker closing');
        ShutdownHandler_1.default.unregister(this.close);
        await Promise.allSettled([
            ...[...this.adminApis.connections].map(x => x.disconnect()),
            __classPrivateFieldGet(this, _DataBroker_server, "f").close(),
            __classPrivateFieldGet(this, _DataBroker_adminServer, "f").close(),
            __classPrivateFieldGet(this, _DataBroker_localchain, "f").close(),
            __classPrivateFieldGet(this, _DataBroker_db, "f").close(),
            __classPrivateFieldGet(this, _DataBroker_whitelistDb, "f").close(),
        ]);
    }
    async onLocalchainSync(sync) {
        for (const notarization of sync.channelHoldNotarizations) {
            for (const channelHold of await notarization.channelHolds) {
                try {
                    __classPrivateFieldGet(this, _DataBroker_db, "f").transaction(() => {
                        const [organizationId, holdAmount, change] = __classPrivateFieldGet(this, _DataBroker_db, "f").channelHolds.updateSettlementReturningChange(channelHold.id, channelHold.settledAmount, Date.now());
                        __classPrivateFieldGet(this, _DataBroker_db, "f").organizations.settle(organizationId, change, holdAmount);
                    });
                }
                catch (error) {
                    log.error('Error updating settlement in db after finalized in localchain', {
                        error,
                        channelHoldId: channelHold.id,
                        settledAmount: channelHold.settledAmount,
                    });
                }
            }
        }
    }
    async listen(port = 0, hostname = 'localhost') {
        if (!port && !env_1.default.isTestEnv) {
            if (!(await (0, utils_1.isPortInUse)(1814)))
                port = 1814;
        }
        await __classPrivateFieldGet(this, _DataBroker_server, "f").listen({ port, host: hostname });
        await __classPrivateFieldGet(this, _DataBroker_isStarted, "f").promise;
    }
    async listenAdmin(port) {
        if (!port && !env_1.default.isTestEnv) {
            if (!(await (0, utils_1.isPortInUse)(18171)))
                port = 18171;
        }
        await __classPrivateFieldGet(this, _DataBroker_adminServer, "f").listen({ port, host: 'localhost' });
    }
    getApiContext(remoteId) {
        return {
            logger: log.createChild(module, { remote: remoteId }),
            db: __classPrivateFieldGet(this, _DataBroker_db, "f"),
            datastoreWhitelist: __classPrivateFieldGet(this, _DataBroker_whitelistDb, "f"),
            configuration: this.configuration,
            datastoreApiClients: __classPrivateFieldGet(this, _DataBroker_datastoreApiClients, "f"),
            localchain: __classPrivateFieldGet(this, _DataBroker_localchain, "f"),
        };
    }
}
_DataBroker_server = new WeakMap(), _DataBroker_adminServer = new WeakMap(), _DataBroker_whitelistDb = new WeakMap(), _DataBroker_db = new WeakMap(), _DataBroker_datastoreApiClients = new WeakMap(), _DataBroker_localchain = new WeakMap(), _DataBroker_isStarted = new WeakMap();
exports.default = DataBroker;
//# sourceMappingURL=index.js.map