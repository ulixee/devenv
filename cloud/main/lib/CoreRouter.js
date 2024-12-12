"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("@ulixee/commons/lib/Logger");
const utils_1 = require("@ulixee/commons/lib/utils");
const net_1 = require("@ulixee/net");
const ApiRegistry_1 = require("@ulixee/net/lib/ApiRegistry");
const WsTransportToClient_1 = require("@ulixee/net/lib/WsTransportToClient");
const Cloud_status_1 = require("../endpoints/Cloud.status");
const HostedServiceEndpoints_1 = require("../endpoints/HostedServiceEndpoints");
const { log } = (0, Logger_1.default)(module);
class CoreRouter {
    // @deprecated - use CloudNode.datastoreConfiguration
    set datastoreConfiguration(value) {
        this.cloudNode.datastoreConfiguration = value;
    }
    // @deprecated - use CloudNode.heroConfiguration
    set heroConfiguration(value) {
        this.cloudNode.heroConfiguration = value;
    }
    constructor(cloudNode) {
        this.cloudNode = cloudNode;
        this.connections = new Set();
        this.cloudApiRegistry = new ApiRegistry_1.default([Cloud_status_1.default]);
        this.wsConnectionByType = {
            hero: transport => this.cloudNode.heroCore.addConnection(transport),
            datastore: transport => this.cloudNode.datastoreCore.addConnection(transport),
            services: transport => this.addHostedServicesConnection(transport),
            cloud: transport => this.cloudApiRegistry.createConnection(transport, this.getApiContext()),
        };
        this.httpRoutersByType = {};
    }
    async register() {
        const cloudNodeAddress = await this.cloudNode.address;
        /// CLUSTER APIS /////////////
        this.cloudNode.hostedServicesServer?.addHttpRoute('/', 'GET', this.handleHostedServicesRoot.bind(this));
        this.cloudNode.hostedServicesServer?.addWsRoute('/services', this.handleSocketRequest.bind(this, 'services'));
        /// PUBLIC APIS /////////////
        this.cloudNode.publicServer.addWsRoute('/hero', this.handleSocketRequest.bind(this, 'hero'));
        this.cloudNode.publicServer.addWsRoute('/datastore', this.handleSocketRequest.bind(this, 'datastore'));
        this.cloudNode.publicServer.addHttpRoute('/server-details', 'GET', this.handleHttpServerDetails.bind(this));
        this.nodeAddress = (0, utils_1.toUrl)(cloudNodeAddress);
        if (this.cloudNode.hostedServicesServer) {
            this.hostedServiceEndpoints = new HostedServiceEndpoints_1.default();
            this.hostedServicesAddress = this.cloudNode.hostedServicesHostURL;
        }
        this.cloudNode.datastoreCore.registerHttpRoutes(this.addHttpRoute.bind(this));
        if (this.cloudNode.desktopCore) {
            const bridge = new net_1.TransportBridge();
            this.cloudApiRegistry.createConnection(bridge.transportToClient, this.getApiContext());
            const loopbackConnection = new net_1.ConnectionToCore(bridge.transportToCore);
            this.cloudNode.desktopCore.bindConnection(loopbackConnection);
            this.cloudNode.desktopCore.registerWsRoutes(this.addWsRoute.bind(this));
        }
        // last option
        this.cloudNode.publicServer.addHttpRoute('/', 'GET', this.handleHome.bind(this));
    }
    async close() {
        this.isClosing ??= Promise.allSettled([...this.connections].map(x => x.disconnect())).then(() => null);
        return this.isClosing;
    }
    addHostedServicesConnection(transport) {
        const connection = this.cloudNode.datastoreCore.addHostedServicesConnection(transport);
        this.hostedServiceEndpoints?.attachToConnection(connection, this.getApiContext());
        return connection;
    }
    addHttpRoute(route, method, callbackFn) {
        const key = `${method}_${route.toString()}`;
        this.httpRoutersByType[key] = callbackFn;
        this.cloudNode.publicServer.addHttpRoute(route, method, this.handleHttpRequest.bind(this, key));
    }
    addWsRoute(route, callbackFn, useTransport = true) {
        const key = `${route.toString()}`;
        this.wsConnectionByType[key] = callbackFn;
        if (useTransport) {
            this.cloudNode.publicServer.addWsRoute(route, this.handleSocketRequest.bind(this, key));
        }
        else {
            this.cloudNode.publicServer.addWsRoute(route, this.handleRawSocketRequest.bind(this, key));
        }
    }
    getApiContext() {
        return {
            logger: log.createChild(module, {}),
            nodeRegistry: this.cloudNode.nodeRegistry,
            nodeTracker: this.cloudNode.nodeTracker,
            cloudConfiguration: this.cloudNode.cloudConfiguration,
            datastoreConfiguration: this.cloudNode.datastoreCore.options,
            hostedServicesAddress: this.hostedServicesAddress,
            nodeAddress: this.nodeAddress,
            version: this.cloudNode.version,
        };
    }
    handleHome(_req, res) {
        res.end(`Ulixee Cloud v${this.cloudNode.version}`);
    }
    async handleRawSocketRequest(connectionType, ws, req) {
        await this.wsConnectionByType[connectionType](ws, req);
        this.connections.add({
            disconnect() {
                ws.terminate();
                return Promise.resolve();
            },
        });
    }
    async handleSocketRequest(connectionType, ws, req) {
        const transport = new WsTransportToClient_1.default(ws, req);
        const connection = await this.wsConnectionByType[connectionType](transport, req);
        if (!connection) {
            throw new Error(`Unknown connection protocol attempted "${connectionType}"`);
        }
        this.connections.add(connection);
        connection.once('disconnected', () => this.connections.delete(connection));
    }
    async handleHttpRequest(connectionType, req, res, params) {
        return await this.httpRoutersByType[connectionType](req, res, params);
    }
    handleHttpServerDetails(_, res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ipAddress: this.nodeAddress.hostname, port: this.nodeAddress.port }));
    }
    handleHostedServicesRoot(_, res) {
        res.setHeader('Content-Type', 'application/json');
        const { datastoreRegistryHost, storageEngineHost, statsTrackerHost, replayRegistryHost } = this.cloudNode.datastoreCore.options;
        const { nodeRegistryHost } = this.cloudNode.cloudConfiguration;
        const settings = {
            datastoreRegistryHost,
            storageEngineHost,
            nodeRegistryHost,
            statsTrackerHost,
            replayRegistryHost,
        };
        res.end(JSON.stringify(settings));
    }
}
exports.default = CoreRouter;
//# sourceMappingURL=CoreRouter.js.map