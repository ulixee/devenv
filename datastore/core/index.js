"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const objectUtils_1 = require("@ulixee/commons/lib/objectUtils");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const datastore_1 = require("@ulixee/datastore");
const ArgonPaymentProcessor_1 = require("@ulixee/datastore-core/lib/ArgonPaymentProcessor");
const DatastoreApiClients_1 = require("@ulixee/datastore/lib/DatastoreApiClients");
const DatastoreLookup_1 = require("@ulixee/datastore/lib/DatastoreLookup");
const EmbeddedPaymentService_1 = require("@ulixee/datastore/payments/EmbeddedPaymentService");
const LocalchainWithSync_1 = require("@ulixee/datastore/payments/LocalchainWithSync");
const RemoteReserver_1 = require("@ulixee/datastore/payments/RemoteReserver");
const ApiRegistry_1 = require("@ulixee/net/lib/ApiRegistry");
const TransportBridge_1 = require("@ulixee/net/lib/TransportBridge");
const Ed25519_1 = require("@ulixee/platform-utils/lib/Ed25519");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const fs_1 = require("fs");
const Path = require("path");
const ChannelHold_register_1 = require("./endpoints/ChannelHold.register");
const Datastore_admin_1 = require("./endpoints/Datastore.admin");
const Datastore_createStorageEngine_1 = require("./endpoints/Datastore.createStorageEngine");
const Datastore_creditsBalance_1 = require("./endpoints/Datastore.creditsBalance");
const Datastore_creditsIssued_1 = require("./endpoints/Datastore.creditsIssued");
const Datastore_download_1 = require("./endpoints/Datastore.download");
const Datastore_meta_1 = require("./endpoints/Datastore.meta");
const Datastore_query_1 = require("./endpoints/Datastore.query");
const Datastore_queryStorageEngine_1 = require("./endpoints/Datastore.queryStorageEngine");
const Datastore_start_1 = require("./endpoints/Datastore.start");
const Datastore_stats_1 = require("./endpoints/Datastore.stats");
const Datastore_stream_1 = require("./endpoints/Datastore.stream");
const Datastore_upload_1 = require("./endpoints/Datastore.upload");
const Datastore_versions_1 = require("./endpoints/Datastore.versions");
const Datastores_list_1 = require("./endpoints/Datastores.list");
const DocpageRoutes_1 = require("./endpoints/DocpageRoutes");
const HostedServicesEndpoints_1 = require("./endpoints/HostedServicesEndpoints");
const env_1 = require("./env");
const ArgonPaymentProcessorClient_1 = require("./lib/ArgonPaymentProcessorClient");
const DatastoreHostLookupClient_1 = require("./lib/DatastoreHostLookupClient");
const DatastoreRegistry_1 = require("./lib/DatastoreRegistry");
const DatastoreVm_1 = require("./lib/DatastoreVm");
const errors_1 = require("./lib/errors");
const StatsTracker_1 = require("./lib/StatsTracker");
const StorageEngineRegistry_1 = require("./lib/StorageEngineRegistry");
const translateDatastoreMetadata_1 = require("./lib/translateDatastoreMetadata");
const WorkTracker_1 = require("./lib/WorkTracker");
const { log } = (0, Logger_1.default)(module);
class DatastoreCore extends TypedEventEmitter_1.default {
    get datastoresDir() {
        return this.options.datastoresDir;
    }
    get queryHeroSessionsDir() {
        return this.options.queryHeroSessionsDir;
    }
    constructor(options, plugins) {
        super();
        this.pluginCoresByName = {};
        this.connections = new Set();
        this.apiRegistry = new ApiRegistry_1.default([
            Datastore_query_1.default,
            Datastore_stream_1.default,
            Datastores_list_1.default,
            Datastore_admin_1.default,
            Datastore_creditsBalance_1.default,
            Datastore_creditsIssued_1.default,
            Datastore_start_1.default,
            Datastore_versions_1.default,
            Datastore_stats_1.default,
            Datastore_meta_1.default,
            Datastore_download_1.default,
            Datastore_upload_1.default,
            Datastore_queryStorageEngine_1.default,
            Datastore_createStorageEngine_1.default,
            ChannelHold_register_1.default,
        ]);
        this.isStarted = new Resolvable_1.default();
        this.options = {
            serverEnvironment: env_1.default.serverEnvironment,
            datastoresDir: env_1.default.datastoresDir,
            datastoresTmpDir: env_1.default.datastoresTmpDir,
            maxRuntimeMs: 10 * 60e3,
            waitForDatastoreCompletionOnShutdown: true,
            enableDatastoreWatchMode: env_1.default.serverEnvironment === 'development',
            datastoresMustHaveOwnAdminIdentity: env_1.default.datastoresMustHaveOwnAdminIdentity,
            cloudAdminIdentities: env_1.default.cloudAdminIdentities,
            datastoreRegistryHost: env_1.default.datastoreRegistryHost,
            storageEngineHost: env_1.default.storageEngineHost,
            statsTrackerHost: env_1.default.statsTrackerHost,
            queryHeroSessionsDir: env_1.default.queryHeroSessionsDir,
            replayRegistryHost: env_1.default.replayRegistryHost,
            argonPaymentProcessorHost: env_1.default.argonPaymentProcessorHost,
            upstreamPaymentsServiceHost: env_1.default.upstreamPaymentsServiceHost,
            datastoreLookupHost: env_1.default.datastoreLookupHost,
            localchainConfig: env_1.default.localchainConfig,
            ...(options ?? {}),
        };
        if (plugins)
            for (const pluginCore of plugins) {
                this.pluginCoresByName[pluginCore.name] = pluginCore;
            }
    }
    addConnection(transport) {
        const context = this.getApiContext(transport.remoteId);
        const connection = this.apiRegistry.createConnection(transport, context);
        const logger = context.logger;
        connection.on('response', ({ response, request, metadata }) => {
            logger.info(`api/${request.command} (${request.messageId})`, {
                args: request.args?.[0],
                response: response.data,
                ...metadata,
            });
        });
        context.connectionToClient = connection;
        connection.once('disconnected', () => {
            this.connections.delete(connection);
        });
        this.emit('connection', { connection });
        this.connections.add(connection);
        return connection;
    }
    addHostedServicesConnection(transport) {
        if (!this.hostedServicesEndpoints) {
            throw new Error('This CloudNode has not been configured to provide Services services.');
        }
        const context = this.getApiContext(transport.remoteId);
        const connection = this.hostedServicesEndpoints.addConnection(transport, context);
        for (const plugin of Object.values(this.pluginCoresByName)) {
            plugin.registerHostedServices?.(connection);
        }
        const logger = context.logger;
        connection.on('response', ({ response, request, metadata }) => {
            logger.info(`services/api/${request.command} (${request.messageId})`, {
                args: request.args?.[0],
                response: response.data,
                ...metadata,
            });
        });
        return connection;
    }
    registerHttpRoutes(addHttpRoute) {
        addHttpRoute(/.*\/free-credit\/?\?crd[A-Za-z0-9_]{8}.*/, 'GET', (req, res) => this.docPages.routeCreditsBalanceApi(req, res));
        addHttpRoute(new RegExp(DocpageRoutes_1.datastorePathRegex), 'GET', (req, res, params) => this.docPages.routeHttp(req, res, params));
    }
    async start(options) {
        if (this.isStarted.isResolved)
            return this.isStarted.promise;
        const { nodeAddress, networkIdentity, defaultServices, hostedServicesAddress, createConnectionToServiceHost, } = options;
        if (defaultServices) {
            Object.assign(this.options, (0, objectUtils_1.filterUndefined)(defaultServices));
        }
        if (this.options.storageEngineHost === 'self') {
            this.options.storageEngineHost = nodeAddress.href;
        }
        if (hostedServicesAddress) {
            // if this node is hosting services, default hosts here
            const servicesHost = hostedServicesAddress?.href;
            // if there's a hosted services address, a storage engine host is required!
            //  -- otherwise, engine db could be on different host than datastore storage
            this.options.storageEngineHost ??= nodeAddress.href;
            // replace "self" if provided
            if (this.options.statsTrackerHost === 'self')
                this.options.statsTrackerHost = servicesHost;
            if (this.options.datastoreRegistryHost === 'self')
                this.options.datastoreRegistryHost = servicesHost;
            if (this.options.replayRegistryHost === 'self')
                this.options.replayRegistryHost = servicesHost;
            if (this.options.upstreamPaymentsServiceHost === 'self')
                this.options.upstreamPaymentsServiceHost = servicesHost;
            if (this.options.datastoreLookupHost === 'self')
                this.options.datastoreLookupHost = servicesHost;
            if (this.options.argonPaymentProcessorHost === 'self')
                this.options.argonPaymentProcessorHost = servicesHost;
            this.options.statsTrackerHost ??= servicesHost;
            this.options.datastoreRegistryHost ??= servicesHost;
            // start a services services provider
            this.hostedServicesEndpoints = new HostedServicesEndpoints_1.default();
        }
        const startLogId = log.info('DatastoreCore.start', {
            options: this.options,
            sessionId: null,
        });
        this.cloudNodeAddress = nodeAddress;
        this.cloudNodeIdentity = networkIdentity;
        try {
            this.close = this.close.bind(this);
            if (this.options.serverEnvironment === 'production' &&
                !this.options.cloudAdminIdentities.length) {
                this.showTemporaryAdminIdentityPrompt();
            }
            if (!(await (0, fileUtils_1.existsAsync)(this.options.datastoresTmpDir))) {
                await fs_1.promises.mkdir(this.options.datastoresTmpDir, { recursive: true });
            }
            if (!(await (0, fileUtils_1.existsAsync)(this.options.queryHeroSessionsDir))) {
                await fs_1.promises.mkdir(this.options.queryHeroSessionsDir, { recursive: true });
            }
            if (this.options.datastoreRegistryHost && !this.options.storageEngineHost) {
                throw new errors_1.MissingRequiredSettingError('DatastoreCore has been configured with a remote Datastore Registry, but no StorageEngineHost (ULX_STORAGE_ENGINE_HOST). Remote Datastores must have an IP addressable storage engine.', 'storageEngineHost');
            }
            const bridge = new TransportBridge_1.default();
            this.connectionToThisCore = new datastore_1.ConnectionToDatastoreCore(bridge.transportToCore);
            this.datastoreApiClients = new DatastoreApiClients_1.default();
            const lookupConnection = createConnectionToServiceHost(this.options.datastoreLookupHost);
            if (lookupConnection)
                this.datastoreHostLookup = new DatastoreHostLookupClient_1.default(lookupConnection);
            if (this.options.localchainConfig?.localchainCreateIfMissing) {
                this.options.localchainConfig.localchainPath ??= localchain_1.Localchain.getDefaultPath();
            }
            if (this.options.localchainConfig?.localchainPath) {
                this.localchain = await LocalchainWithSync_1.default.load(this.options.localchainConfig);
                if (this.options.localchainConfig?.localchainCreateIfMissing) {
                    await this.localchain.createIfMissing();
                }
                this.upstreamDatastorePaymentService = await this.localchain.createPaymentService(this.datastoreApiClients);
                this.argonPaymentProcessor = new ArgonPaymentProcessor_1.default(this.options.datastoresDir, this.localchain);
            }
            else {
                const paymentServiceConnection = createConnectionToServiceHost(this.options.upstreamPaymentsServiceHost);
                const argonReserver = paymentServiceConnection
                    ? new RemoteReserver_1.default(paymentServiceConnection)
                    : undefined;
                this.upstreamDatastorePaymentService = new EmbeddedPaymentService_1.default(argonReserver);
                const channelHoldConnection = createConnectionToServiceHost(this.options.argonPaymentProcessorHost);
                if (channelHoldConnection) {
                    this.argonPaymentProcessor = new ArgonPaymentProcessorClient_1.default(channelHoldConnection);
                }
            }
            if (!(await this.argonPaymentProcessor?.getPaymentInfo())) {
                log.warn("DatastoreCore.start - No Argon Payment information found. Can't charge for Datastores.");
            }
            if (!this.datastoreHostLookup) {
                const mainchainClient = env_1.default.argonMainchainUrl
                    ? localchain_1.MainchainClient.connect(env_1.default.argonMainchainUrl, 10e3).catch(err => {
                        log.warn('Unable to connect to mainchain client', { error: err });
                        return null;
                    })
                    : undefined;
                this.datastoreHostLookup = new DatastoreLookup_1.default(mainchainClient);
            }
            this.vm = new DatastoreVm_1.default(this.connectionToThisCore, this.datastoreApiClients, Object.values(this.pluginCoresByName), this.datastoreHostLookup, this.upstreamDatastorePaymentService);
            this.storageEngineRegistry = new StorageEngineRegistry_1.default(this.options.datastoresDir, this.cloudNodeAddress);
            this.statsTracker = new StatsTracker_1.default(this.options.datastoresDir, createConnectionToServiceHost(this.options.statsTrackerHost));
            this.datastoreRegistry = new DatastoreRegistry_1.default(this.options.datastoresDir, createConnectionToServiceHost(this.options.datastoreRegistryHost), this.options, this.onDatastoreInstalled.bind(this));
            this.docPages = new DocpageRoutes_1.default(this.datastoreRegistry, this.cloudNodeAddress, args => Datastore_creditsBalance_1.default.handler(args, this.getApiContext()));
            await this.datastoreRegistry.diskStore.installOnDiskUploads(this.options.cloudAdminIdentities);
            for (const plugin of Object.values(this.pluginCoresByName)) {
                await plugin.onCoreStart?.(this.options, {
                    createConnectionToServiceHost,
                    getSystemCore: options.getSystemCore,
                });
            }
            this.workTracker = new WorkTracker_1.default(this.options.maxRuntimeMs);
            log.stats('DatastoreCore.started', {
                parentLogId: startLogId,
                sessionId: null,
            });
            this.isStarted.resolve();
            // must be started before we can register for events
            this.addConnection(bridge.transportToClient);
            this.datastoreRegistry.on('new', this.onNewDatastore.bind(this));
            this.statsTracker.on('stats', this.onDatastoreStats.bind(this));
            this.datastoreRegistry.on('stopped', this.onDatastoreStopped.bind(this));
        }
        catch (error) {
            log.stats('DatastoreCore.startError', {
                parentLogId: startLogId,
                error,
                sessionId: null,
            });
            this.isStarted.reject(error, true);
        }
        return this.isStarted;
    }
    async copyDbxToStartDir(path) {
        const filename = Path.basename(path);
        const dest = Path.join(this.options.datastoresDir, filename);
        if (!(await (0, fileUtils_1.existsAsync)(dest))) {
            if (!(await (0, fileUtils_1.existsAsync)(this.options.datastoresDir))) {
                await fs_1.promises.mkdir(this.options.datastoresDir, { recursive: true });
            }
            await fs_1.promises.copyFile(path, dest);
        }
    }
    async close() {
        if (this.isClosing)
            return this.isClosing;
        const closingPromise = new Resolvable_1.default();
        this.isClosing = closingPromise.promise;
        const logid = log.stats('DatastoreCore.Closing', {
            sessionId: null,
        });
        try {
            await this.workTracker?.stop(this.options.waitForDatastoreCompletionOnShutdown);
            for (const connection of this.connections) {
                await connection.disconnect();
            }
            this.connections.clear();
            await Promise.allSettled([
                ...Object.values(this.pluginCoresByName).map(x => x.onCoreClose?.()),
                this.datastoreRegistry?.close(),
                this.storageEngineRegistry?.close(),
                this.localchain?.close(),
                this.upstreamDatastorePaymentService?.close(),
                this.datastoreApiClients?.close(),
                this.statsTracker?.close(),
            ]);
            this.pluginCoresByName = {};
            closingPromise.resolve();
        }
        catch (error) {
            closingPromise.reject(error);
        }
        finally {
            log.stats('DatastoreCore.Closed', { parentLogId: logid, sessionId: null });
        }
    }
    async onDatastoreInstalled(version, source, previous, options) {
        if (source === 'cluster')
            return;
        if (this.storageEngineRegistry.isHostingStorageEngine(version.storageEngineHost)) {
            await this.storageEngineRegistry.create(this.vm, version, previous, options);
        }
        else {
            const versionDbx = await this.datastoreRegistry.diskStore.getCompressedDbx(version.id, version.version);
            const previousDbx = await this.datastoreRegistry.diskStore.getCompressedDbx(previous?.id, previous?.version);
            await this.storageEngineRegistry.createRemote(version, versionDbx, previousDbx);
        }
    }
    onNewDatastore(event) {
        void Datastore_meta_1.default.handler({ id: event.datastore.id, version: event.datastore.version }, this.getApiContext()).then(x => {
            return this.emit('new', { activity: event.activity, datastore: x });
        });
    }
    async onDatastoreStopped(event) {
        this.emit('stopped', event);
        await this.storageEngineRegistry.deleteExisting(event.id, event.version);
    }
    onDatastoreStats(event) {
        this.emit('stats', {
            id: event.datastoreId,
            version: event.version,
            stats: (0, translateDatastoreMetadata_1.translateStats)(event),
        });
    }
    getApiContext(remoteId) {
        if (!this.isStarted.isResolved) {
            throw new Error('DatastoreCore has not started');
        }
        return {
            logger: log.createChild(module, { remoteId }),
            datastoreRegistry: this.datastoreRegistry,
            workTracker: this.workTracker,
            configuration: this.options,
            pluginCoresByName: this.pluginCoresByName,
            storageEngineRegistry: this.storageEngineRegistry,
            cloudNodeAddress: this.cloudNodeAddress,
            cloudNodeIdentity: this.cloudNodeIdentity,
            vm: this.vm,
            datastoreApiClients: this.datastoreApiClients,
            statsTracker: this.statsTracker,
            argonPaymentProcessor: this.argonPaymentProcessor,
            upstreamDatastorePaymentService: this.upstreamDatastorePaymentService,
            datastoreLookup: this.datastoreHostLookup,
        };
    }
    showTemporaryAdminIdentityPrompt() {
        const tempIdentity = Identity_1.default.createSync();
        this.options.cloudAdminIdentities.push(tempIdentity.bech32);
        const key = Ed25519_1.default.getPrivateKeyBytes(tempIdentity.privateKey);
        console.warn(`\n
############################################################################################
############################################################################################
###########################  TEMPORARY ADMIN IDENTITY  #####################################
############################################################################################
############################################################################################

            A temporary adminIdentity has been installed on your server. 

       To perform admin activities (like issuing Credits for a Datastore), you should 
                 save and use this Identity from your local system:

 npx @ulixee/datastore admin-identity save --privateKey=${key.toString('base64')}

--------------------------------------------------------------------------------------------
       
           To dismiss this message, add the following environment variable:
           
 ULX_CLOUD_ADMIN_IDENTITIES=${tempIdentity.bech32},

############################################################################################
############################################################################################
############################################################################################
\n\n`);
    }
}
exports.default = DatastoreCore;
//# sourceMappingURL=index.js.map