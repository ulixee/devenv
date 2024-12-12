"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosts_1 = require("@ulixee/commons/config/hosts");
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const ShutdownHandler_1 = require("@ulixee/commons/lib/ShutdownHandler");
const utils_1 = require("@ulixee/commons/lib/utils");
const datastore_core_1 = require("@ulixee/datastore-core");
const desktop_core_1 = require("@ulixee/desktop-core");
const hero_core_1 = require("@ulixee/hero-core");
const net_1 = require("@ulixee/net");
const Ed25519_1 = require("@ulixee/platform-utils/lib/Ed25519");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const Http = require("http");
const Https = require("https");
const Path = require("path");
const env_1 = require("../env");
const CoreRouter_1 = require("./CoreRouter");
const NodeRegistry_1 = require("./NodeRegistry");
const NodeTracker_1 = require("./NodeTracker");
const RoutableServer_1 = require("./RoutableServer");
const pkg = require('../package.json');
const isTestEnv = process.env.NODE_ENV === 'test';
const { log } = (0, Logger_1.default)(module);
class CloudNode {
    get datastoreConfiguration() {
        return this.datastoreCore.options;
    }
    set datastoreConfiguration(value) {
        Object.assign(this.datastoreCore.options, value);
    }
    get port() {
        return this.publicServer.port;
    }
    get host() {
        return this.publicServer.host;
    }
    // @deprecated - use host
    get address() {
        return this.publicServer.host;
    }
    get version() {
        return pkg.version;
    }
    constructor(config = { shouldShutdownOnSignals: true }) {
        this.shouldShutdownOnSignals = true;
        this.cloudConfiguration = {
            nodeRegistryHost: env_1.default.nodeRegistryHost,
            servicesSetupHost: env_1.default.servicesSetupHost,
            networkIdentity: env_1.default.networkIdentity,
            port: env_1.default.publicPort ? Number(env_1.default.publicPort) : undefined,
            host: env_1.default.listenHostname,
            publicHost: env_1.default.publicHost,
            disableDesktopCore: env_1.default.disableDesktopApi,
            hostedServicesServerOptions: (env_1.default.hostedServicesPort ?? env_1.default.hostedServicesListenHostname)
                ? {
                    port: env_1.default.hostedServicesPort ? Number(env_1.default.hostedServicesPort) : undefined,
                    host: env_1.default.hostedServicesListenHostname,
                }
                : null,
        };
        this.isReady = new Resolvable_1.default();
        this.didReservePort = false;
        this.connectionsToServicesByHost = {};
        (0, utils_1.bindFunctions)(this);
        const { heroConfiguration, datastoreConfiguration, shouldShutdownOnSignals, ...cloudConfiguration } = config;
        const { hostedServicesServerOptions, ...other } = cloudConfiguration;
        Object.assign(this.cloudConfiguration, other ?? {});
        if (hostedServicesServerOptions) {
            this.cloudConfiguration.hostedServicesServerOptions ??= {};
            Object.assign(this.cloudConfiguration.hostedServicesServerOptions, hostedServicesServerOptions ?? {});
        }
        this.router = new CoreRouter_1.default(this);
        this.datastoreCore = new datastore_core_1.default(datastoreConfiguration ?? {}, this.getInstalledDatastorePlugins());
        this.shouldShutdownOnSignals = shouldShutdownOnSignals ?? true;
        this.heroConfiguration = heroConfiguration ?? {};
        this.heroConfiguration.shouldShutdownOnSignals ??= this.shouldShutdownOnSignals;
        this.heroCore = new hero_core_1.default(this.heroConfiguration);
        if (!this.shouldShutdownOnSignals)
            ShutdownHandler_1.default.disableSignals = true;
        ShutdownHandler_1.default.register(this.close);
    }
    async listen() {
        if (this.isStarting)
            return this.isStarting;
        const startLogId = log.info('CloudNode.start');
        this.isStarting = new Resolvable_1.default();
        try {
            await this.startPublicServer();
            await this.startHostedServices();
            await this.startCores();
            // NOTE: must wait for cores to be available
            await this.router.register();
            // wait until router is registered before accepting traffic
            this.isReady.resolve();
        }
        finally {
            this.isStarting.resolve(this);
            log.stats('CloudNode.started', {
                publicHost: await this.publicServer.host,
                hostedServicesHost: await this.hostedServicesServer?.host,
                cloudConfiguration: this.cloudConfiguration,
                parentLogId: startLogId,
                sessionId: null,
            });
        }
        return this;
    }
    async close() {
        if (this.isClosing) {
            return this.isClosing;
        }
        const resolvable = new Resolvable_1.default();
        const logid = log.stats('CloudNode.Closing');
        try {
            this.isClosing = resolvable.promise;
            ShutdownHandler_1.default.unregister(this.close);
            this.heroCore.off('close', this.close);
            if (this.didReservePort) {
                this.clearReservedPort();
            }
            await this.router.close();
            await this.nodeRegistry?.close();
            this.desktopCore?.disconnect();
            await this.heroCore.close();
            await this.datastoreCore.close();
            await Promise.allSettled([
                ...Object.values(this.connectionsToServicesByHost).map(x => x.disconnect()),
                this.publicServer.close(),
                this.hostedServicesServer?.close(),
            ]);
            resolvable.resolve();
        }
        catch (error) {
            log.error('Error closing socket connections', {
                error,
            });
            resolvable.reject(error);
        }
        finally {
            log.stats('CloudNode.Closed', { parentLogId: logid, sessionId: null });
        }
        return resolvable.promise;
    }
    async startCores() {
        const nodeAddress = (0, utils_1.toUrl)(await this.publicServer.host);
        const hostedServicesAddress = (0, utils_1.toUrl)(await this.hostedServicesServer?.host);
        if (this.cloudConfiguration.nodeRegistryHost === 'self') {
            this.cloudConfiguration.nodeRegistryHost = hostedServicesAddress.host;
        }
        let servicesSetup;
        const setupHost = (0, utils_1.toUrl)(this.cloudConfiguration.servicesSetupHost);
        // don't dial self
        if (setupHost &&
            nodeAddress.host !== setupHost.host &&
            hostedServicesAddress?.host !== setupHost.host) {
            servicesSetup = await this.getServicesSetup(setupHost.host);
            this.cloudConfiguration.nodeRegistryHost ??= servicesSetup.nodeRegistryHost;
            log.info('CloudNode.servicesSetup', { servicesSetup, sessionId: null });
        }
        this.nodeTracker = new NodeTracker_1.default();
        this.nodeRegistry = new NodeRegistry_1.default({
            datastoreCore: this.datastoreCore,
            heroCore: this.heroCore,
            publicServer: this.publicServer,
            serviceClient: this.createConnectionToServiceHost(this.cloudConfiguration.nodeRegistryHost),
            nodeTracker: this.nodeTracker,
        });
        if ((this.nodeRegistry.serviceClient || this.cloudConfiguration.nodeRegistryHost) &&
            !this.cloudConfiguration.networkIdentity) {
            await this.createTemporaryNetworkIdentity();
        }
        await this.nodeRegistry.register(this.cloudConfiguration.networkIdentity);
        await this.heroCore.start();
        this.heroCore.once('close', this.close);
        await this.datastoreCore.start({
            nodeAddress,
            networkIdentity: this.cloudConfiguration.networkIdentity,
            hostedServicesAddress,
            defaultServices: servicesSetup,
            createConnectionToServiceHost: this.createConnectionToServiceHost,
            getSystemCore: (name) => {
                if (name === 'heroCore')
                    return this.heroCore;
                if (name === 'datastoreCore')
                    return this.datastoreCore;
                if (name === 'desktopCore')
                    return this.desktopCore;
            },
        });
        /// START DESKTOP
        if (this.cloudConfiguration.disableDesktopCore !== true) {
            this.desktopCore = new desktop_core_1.default(this.datastoreCore, this.heroCore);
            this.desktopCore.activatePlugin();
        }
    }
    createConnectionToServiceHost(serviceHost) {
        const serviceURL = (0, utils_1.toUrl)(serviceHost);
        if (!serviceURL)
            return null;
        const hostURL = new URL('/services', serviceURL);
        // safeguard against looping back to self
        if (!hostURL || this.hostedServicesHostURL?.origin === hostURL.origin)
            return null;
        this.connectionsToServicesByHost[hostURL.host] ??= new net_1.ConnectionToCore(new net_1.WsTransportToCore(hostURL.href));
        return this.connectionsToServicesByHost[hostURL.host];
    }
    async startPublicServer() {
        const listenOptions = this.cloudConfiguration;
        this.publicServer = new RoutableServer_1.default(this.isReady.promise, listenOptions.publicHost);
        const isPortUnreserved = !listenOptions.port;
        if (isPortUnreserved && !isTestEnv) {
            if (!(await (0, utils_1.isPortInUse)(1818)))
                listenOptions.port = 1818;
        }
        const { address, port } = await this.publicServer.listen(listenOptions);
        // if we're dealing with local or no configuration, set the local version host
        if (isLocalhost(address) && isPortUnreserved && !isTestEnv) {
            // publish port with the version
            hosts_1.default.global.setVersionHost(this.version, `localhost:${port}`);
            this.didReservePort = true;
            ShutdownHandler_1.default.register(this.clearReservedPort, true);
        }
        return await this.publicServer.host;
    }
    clearReservedPort() {
        hosts_1.default.global.setVersionHost(this.version, null);
    }
    async startHostedServices() {
        const listenOptions = this.cloudConfiguration.hostedServicesServerOptions;
        if (!listenOptions)
            return;
        this.hostedServicesServer = new RoutableServer_1.default(this.isReady.promise, this.cloudConfiguration.publicHost);
        if (!listenOptions.port && !isTestEnv) {
            if (!(await (0, utils_1.isPortInUse)(18181)))
                listenOptions.port = 18181;
        }
        await this.hostedServicesServer.listen(listenOptions);
        this.hostedServicesHostURL = (0, utils_1.toUrl)(await this.hostedServicesServer.host);
    }
    getInstalledDatastorePlugins() {
        return CloudNode.datastorePluginsToRegister
            .map(x => {
            try {
                let Plugin = require(x); // eslint-disable-line import/no-dynamic-require
                Plugin = Plugin.default || Plugin;
                return new Plugin();
            }
            catch (err) {
                // NOTE: don't warning this by default
                // console.warn('Default Datastore Plugin not installed', path, err.message);
            }
            return null;
        })
            .filter(Boolean);
    }
    getServicesSetup(servicesHost) {
        const url = new URL('/', (0, utils_1.toUrl)(servicesHost));
        if (url.protocol !== 'http:' && url.protocol !== 'https:')
            url.protocol = 'http:';
        const httpModule = url.protocol === 'http:' ? Http : Https;
        return new Promise((resolve, reject) => {
            httpModule
                .get(url, async (res) => {
                res.on('error', reject);
                res.setEncoding('utf8');
                try {
                    let result = '';
                    for await (const chunk of res) {
                        result += chunk;
                    }
                    resolve(JSON.parse(result));
                }
                catch (err) {
                    reject(err);
                }
            })
                .on('error', reject)
                .end();
        });
    }
    async createTemporaryNetworkIdentity() {
        const tempIdentity = await Identity_1.default.create();
        this.cloudConfiguration.networkIdentity = tempIdentity;
        const key = Ed25519_1.default.getPrivateKeyBytes(tempIdentity.privateKey);
        const path = Path.join((0, dirUtils_1.getDataDirectory)(), 'ulixee', 'networkIdentity.pem');
        console.warn(`\n
############################################################################################
############################################################################################
###########################  TEMPORARY NETWORK IDENTITY  ###################################
############################################################################################
############################################################################################

            A temporary networkIdentity has been installed on your server. 

       To create a long-term network identity, you should save and use this Identity 
                          from your local system:

 npx @ulixee/datastore admin-identity save --privateKey=${key.toString('base64')} --filename="${path}"

--------------------------------------------------------------------------------------------
       
           To dismiss this message, add the following environment variable:
           
 ULX_NETWORK_IDENTITY_PATH="${path}",

############################################################################################
############################################################################################
############################################################################################
\n\n`);
    }
}
CloudNode.datastorePluginsToRegister = [
    '@ulixee/datastore-plugins-hero-core',
    '@ulixee/datastore-plugins-puppeteer-core',
];
exports.default = CloudNode;
function isLocalhost(address) {
    return (address === '127.0.0.1' || address === 'localhost' || address === '::' || address === '::1');
}
//# sourceMappingURL=CloudNode.js.map