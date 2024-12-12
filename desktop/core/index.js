"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const SourceMapSupport_1 = require("@ulixee/commons/lib/SourceMapSupport");
const datastore_1 = require("@ulixee/datastore");
const ExtractorInternal_1 = require("@ulixee/datastore/lib/ExtractorInternal");
const hero_core_1 = require("@ulixee/hero-core");
const ConnectionToClient_1 = require("@ulixee/net/lib/ConnectionToClient");
const TransportBridge_1 = require("@ulixee/net/lib/TransportBridge");
const nanoid_1 = require("nanoid");
const AppDevtoolsConnection_1 = require("./lib/AppDevtoolsConnection");
const FullscreenHeroCorePlugin_1 = require("./lib/FullscreenHeroCorePlugin");
const HeroSessionsSearch_1 = require("./lib/HeroSessionsSearch");
const SessionController_1 = require("./lib/SessionController");
const Workarea_1 = require("./lib/Workarea");
const { log } = (0, Logger_1.default)(module);
class DesktopCore {
    get connectionToDatastoreCore() {
        if (!this._connectionToDatastoreCore) {
            const bridge = new TransportBridge_1.default();
            this._connectionToDatastoreCore = new datastore_1.ConnectionToDatastoreCore(bridge.transportToCore);
            this.datastoreCore.addConnection(bridge.transportToClient);
        }
        return this._connectionToDatastoreCore;
    }
    constructor(datastoreCore, heroCore) {
        this.datastoreCore = datastoreCore;
        this.heroCore = heroCore;
        this.sessionControllersById = new Map();
        this.appConnectionsById = new Map();
        this.appDevtoolsConnectionsById = new Map();
        this.events = new EventSubscriber_1.default();
        this.heroSessionsSearch = new HeroSessionsSearch_1.default(heroCore);
    }
    bindConnection(connectionToCloudCore) {
        this.connectionToCloudCore = connectionToCloudCore;
    }
    disconnect() {
        this.datastoreCore = null;
        this.connectionToCloudCore = null;
    }
    registerWsRoutes(addWsRoute) {
        addWsRoute(/\/desktop-devtools\?id=.+/, this.addAppDevtoolsWebsocket.bind(this), false);
        addWsRoute(/\/desktop(\?.+)?/, this.addDesktopConnection.bind(this));
        addWsRoute(/\/chromealive\/.+\?id=.+/, this.addChromeAliveConnection.bind(this));
    }
    addAppDevtoolsWebsocket(ws, request) {
        const url = new URL(request.url, 'http://localhost');
        const id = url.searchParams.get('id');
        if (!id)
            throw new Error('A ChromeAlive devtools connection was made without an id parameter.');
        const connection = new AppDevtoolsConnection_1.default(ws);
        this.appDevtoolsConnectionsById.set(id, connection);
        connection.onCloseFns.push(() => this.appDevtoolsConnectionsById.delete(id));
    }
    async addChromeAliveConnection(transport, request) {
        const chromeAliveMatch = request.url.match(/\/chromealive\/([0-9a-zA-Z-_]{6,})\?id=(.+)/);
        if (chromeAliveMatch) {
            const heroSessionId = chromeAliveMatch[1];
            const connectionId = chromeAliveMatch[2];
            const controller = this.sessionControllersById.get(heroSessionId);
            if (controller)
                return controller.addConnection(transport, request);
            return await this.loadSessionController(heroSessionId, transport, request, connectionId);
        }
    }
    addDesktopConnection(transport, request) {
        const url = new URL(request.url, 'https://localhost');
        const connectionType = url.searchParams.get('type');
        let id;
        const host = request.socket.remoteAddress;
        // give local desktop special permissions. does not need to be specified
        if (connectionType === 'app' &&
            (host === '::1' || host === '::' || host === '127.0.0.1' || host === '::ffff:127.0.0.1')) {
            id = 'local';
        }
        else
            id = (0, nanoid_1.nanoid)(10);
        log.info('Desktop app connected', { id, host, sessionId: null });
        // Desktop initiates a connection to Core. This Core could be remote or local.
        const connection = new ConnectionToClient_1.default(transport, {
            'App.connect': this.onAppConnect.bind(this, id),
            'Sessions.search': this.heroSessionsSearch.search,
            'Sessions.list': this.heroSessionsSearch.list,
            // NOTE: we proxy through some core apis here just to minimize necessary connections
            'Datastores.list': this.delegateToDatastoreCore.bind(this, 'Datastores.list'),
            'Datastore.meta': this.getDatastoreMetaWithExamples.bind(this),
            'Datastore.stats': this.delegateToDatastoreCore.bind(this, 'Datastore.stats'),
            'Datastore.versions': this.delegateToDatastoreCore.bind(this, 'Datastore.versions'),
            'Datastore.creditsIssued': this.delegateToDatastoreCore.bind(this, 'Datastore.creditsIssued'),
        });
        this.appConnectionsById.set(id, connection);
        const eventId = (0, nanoid_1.nanoid)();
        this.events.group(eventId, this.events.on(this.heroSessionsSearch, 'update', x => connection.sendEvent({ data: x, eventType: 'Sessions.listUpdated' })), this.events.on(this.datastoreCore, 'new', x => {
            connection.sendEvent({ data: x, eventType: 'Datastore.new' });
        }), this.events.on(this.datastoreCore, 'stats', x => {
            connection.sendEvent({ data: x, eventType: 'Datastore.stats' });
        }), this.events.on(this.datastoreCore, 'stopped', x => {
            connection.sendEvent({ data: x, eventType: 'Datastore.stopped' });
        }), this.events.on(connection, 'request', msg => {
            log.stats(`${msg.request.command} (${msg.request?.messageId})`, {
                request: msg.request,
                sessionId: null,
            });
        }), this.events.on(connection, 'event', msg => {
            log.stats(msg.event.eventType, {
                ...msg,
                sessionId: null,
            });
        }), this.events.on(connection, 'response', msg => {
            log.info(`${msg.request.command} response (${msg.request?.messageId})`, {
                response: msg.response,
                sessionId: null,
            });
        }));
        this.events.once(connection, 'disconnected', () => {
            this.events.endGroup(eventId);
            this.appConnectionsById.delete(id);
        });
        return connection;
    }
    activatePlugin() {
        log.info('Registering ChromeAlive!');
        this.events.on(hero_core_1.Session.events, 'new', this.onHeroSessionCreated.bind(this));
        hero_core_1.default.use(FullscreenHeroCorePlugin_1.default);
    }
    async onAppConnect(id, args) {
        if (id === 'local') {
            Workarea_1.default.setHeroDefaultScreen(args.workarea);
        }
        const { nodes } = await this.delegateToCloudCore('Cloud.status', {});
        return { id, cloudNodes: nodes };
    }
    async shutdown() {
        log.info('Shutting down Desktop Core!');
        for (const connection of this.appConnectionsById.values()) {
            connection.sendEvent({ eventType: 'App.quit', data: null });
        }
        this.appDevtoolsConnectionsById.clear();
        this.events.close();
        for (const controller of this.sessionControllersById.values()) {
            await controller.close();
        }
        this.sessionControllersById.clear();
        await this.heroSessionsSearch.close();
    }
    async onHeroSessionCreated(event) {
        const { session: heroSession } = event;
        const sessionId = heroSession.id;
        const newSessionEvent = {
            dbPath: heroSession.db.path,
            heroSessionId: sessionId,
            options: heroSession.options,
            startDate: new Date(heroSession.createdTime),
        };
        this.broadcastAppEvent('Session.created', newSessionEvent);
        this.heroSessionsSearch.onNewSession(heroSession);
        const script = heroSession.options.scriptInvocationMeta?.entrypoint;
        if (!script)
            return;
        if (heroSession.options.resumeSessionId || heroSession.options.replaySessionId) {
            SourceMapSupport_1.SourceMapSupport.resetCache();
        }
        if (heroSession.mode === 'browserless') {
            const replaySessionId = heroSession.options.replaySessionId;
            if (replaySessionId) {
                const observer = this.sessionControllersById.get(replaySessionId);
                if (observer)
                    observer.bindExtractor(heroSession);
                return;
            }
            return;
        }
        // ChromeAlive will only show up if specifically requested
        if (!heroSession.options.showChromeAlive) {
            return;
        }
        log.info('New Hero Session Created: %s (%s)', {
            script: script.split('/').pop(),
            sessionId,
        });
        // keep alive session
        heroSession.options.sessionKeepAlive = true;
        try {
            const originalController = this.sessionControllersById.get(heroSession.options.resumeSessionId);
            originalController?.setResuming(heroSession.options.resumeSessionId);
            if (originalController)
                return;
            const { sessionController, appConnectionId } = this.createSessionController(heroSession.db, heroSession.options, heroSession.options.desktopConnectionId);
            if (!sessionController)
                return;
            sessionController.bindLiveSession(heroSession);
            const appConnection = this.appConnectionsById.get(appConnectionId);
            appConnection.sendEvent({
                eventType: 'Session.opened',
                data: {
                    heroSessionId: heroSession.id,
                    options: heroSession.options,
                    dbPath: heroSession.db.path,
                    startDate: new Date(heroSession.createdTime),
                },
            });
        }
        catch (error) {
            log.error('ERROR launching ChromeAlive for Session', { error, sessionId });
        }
    }
    createSessionController(db, options, appConnectionId) {
        // default to the only connection iff only one exists
        if (!appConnectionId && this.appConnectionsById.size === 1) {
            appConnectionId = this.appConnectionsById.keys().next().value;
        }
        if (!this.appDevtoolsConnectionsById.has(appConnectionId)) {
            console.warn('showChromeAlive requested for Hero, but no Desktops available');
            return { sessionController: null, appConnectionId };
        }
        const sessionId = db.sessionId;
        const devtoolsConnection = this.appDevtoolsConnectionsById.get(appConnectionId);
        const sessionController = new SessionController_1.default(db, options, this.datastoreCore.options.datastoresDir, devtoolsConnection);
        this.sessionControllersById.set(sessionId, sessionController);
        this.events.once(sessionController, 'closed', () => {
            this.sessionControllersById.delete(sessionId);
        });
        return { sessionController, appConnectionId };
    }
    delegateToDatastoreCore(command, args) {
        return this.connectionToDatastoreCore.sendRequest({
            command,
            args: [args],
        });
    }
    async getDatastoreMetaWithExamples(args) {
        const meta = (await this.delegateToDatastoreCore('Datastore.meta', args));
        meta.examplesByEntityName = {};
        for (const [name, entry] of [
            ...Object.entries(meta.crawlersByName),
            ...Object.entries(meta.extractorsByName),
        ]) {
            meta.examplesByEntityName[name] = ExtractorInternal_1.default.createExampleCall(name, entry.schemaAsJson);
        }
        for (const name of Object.keys(meta.tablesByName)) {
            meta.examplesByEntityName[name] = {
                formatted: name,
                args: {},
            };
        }
        return meta;
    }
    delegateToCloudCore(command, args) {
        return this.connectionToCloudCore.sendRequest({
            command,
            args: [args],
        });
    }
    async loadSessionController(heroSessionId, transport, request, appConnectionId) {
        const requestUrl = new URL(request.url, 'http://localhost');
        const customDbPath = requestUrl.searchParams.get('path');
        const db = await this.heroCore.sessionRegistry.retain(heroSessionId, customDbPath);
        const dbSession = db.session.get();
        const options = await hero_core_1.Session.restoreOptionsFromSessionRecord({}, heroSessionId, this.heroCore);
        options.scriptInvocationMeta = {
            entrypoint: dbSession.scriptEntrypoint,
            runId: dbSession.scriptRunId,
            productId: dbSession.scriptProductId,
            version: dbSession.scriptVersion,
            runtime: dbSession.scriptRuntime,
            workingDirectory: dbSession.workingDirectory,
            execArgv: dbSession.scriptExecArgv,
            execPath: dbSession.scriptExecPath,
        };
        const { sessionController } = this.createSessionController(db, options, appConnectionId);
        const apiConnection = sessionController.addConnection(transport, request);
        sessionController.loadFromDb().catch(error => {
            log.error('ERROR loading session from database', {
                error,
                sessionId: heroSessionId,
            });
        });
        return apiConnection;
    }
    broadcastAppEvent(eventType, data) {
        for (const client of this.appConnectionsById.values()) {
            client.sendEvent({ eventType, data });
        }
    }
}
exports.default = DesktopCore;
//# sourceMappingURL=index.js.map