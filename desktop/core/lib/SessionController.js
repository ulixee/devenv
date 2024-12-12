"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPendingWaitEvent_1 = require("@ulixee/commons/interfaces/IPendingWaitEvent");
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const SourceLoader_1 = require("@ulixee/commons/lib/SourceLoader");
const SourceMapSupport_1 = require("@ulixee/commons/lib/SourceMapSupport");
const utils_1 = require("@ulixee/commons/lib/utils");
const DetachedAssets_1 = require("@ulixee/hero-core/lib/DetachedAssets");
const CommandTimeline_1 = require("@ulixee/hero-timetravel/lib/CommandTimeline");
const MirrorNetwork_1 = require("@ulixee/hero-timetravel/lib/MirrorNetwork");
const MirrorPage_1 = require("@ulixee/hero-timetravel/lib/MirrorPage");
const TimelineWatch_1 = require("@ulixee/hero-timetravel/lib/TimelineWatch");
const TimetravelPlayer_1 = require("@ulixee/hero-timetravel/player/TimetravelPlayer");
const TimetravelTicks_1 = require("@ulixee/hero-timetravel/player/TimetravelTicks");
const ConnectionToClient_1 = require("@ulixee/net/lib/ConnectionToClient");
const Location_1 = require("@ulixee/unblocked-specification/agent/browser/Location");
const child_process_1 = require("child_process");
const Fs = require("fs");
const ChromeAliveWindowController_1 = require("./ChromeAliveWindowController");
const OutputRebuilder_1 = require("./OutputRebuilder");
const SelectorRecommendations_1 = require("./SelectorRecommendations");
const SessionResourcesWatch_1 = require("./SessionResourcesWatch");
const SourceCodeTimeline_1 = require("./SourceCodeTimeline");
const { log } = (0, Logger_1.default)(module);
class SessionController extends eventUtils_1.TypedEventEmitter {
    get devtoolsBackdoorModule() {
        return this.chromeAliveWindowController.devtoolsBackdoorModule;
    }
    get elementsModule() {
        return this.chromeAliveWindowController.elementsModule;
    }
    constructor(db, options, datastoresDir, devtoolsConnection) {
        super();
        this.db = db;
        this.options = options;
        this.datastoresDir = datastoresDir;
        this.mode = 'Live';
        this.playbackState = 'finished';
        this.mirrorPagesByTabId = {};
        this.worldHeroSessionIds = new Set();
        this.mirrorPagePauseRefreshing = false;
        this.outputRebuilder = new OutputRebuilder_1.default();
        this.lastDomChangesByTabId = {};
        this.isSearchingTimetravel = false;
        this.hasScriptUpdatesSinceLastRun = false;
        this.inputBytes = 0;
        this.connections = [];
        this.events = new EventSubscriber_1.default();
        this.onFirstTab = new Resolvable_1.default();
        (0, utils_1.bindFunctions)(this);
        this.apiHandlers = {
            'Session.openMode': this.openMode,
            'Session.load': this.load,
            'Session.close': this.close,
            'Session.timetravel': this.timetravel,
            'Session.getTimetravelState': this.getTimetravelState,
            'Session.resume': this.resume,
            'Session.pause': this.pause,
            'Session.getScreenshot': this.getScreenshot,
            'Session.getScriptState': this.getScriptState,
            'Session.getDom': this.getDom,
            'Session.getMeta': this.getMeta,
            'Session.searchDom': this.searchDom,
            'Session.searchResources': this.searchResources,
            'Session.getResourceDetails': this.getResourceDetails,
            'Session.getResources': this.getResources,
            'Session.replayTargetCreated': this.onReplayTargetCreated,
            'Session.devtoolsTargetOpened': this.onDevtoolsTargetOpened,
            'Datastore.getOutput': this.getDatastoreOutput,
            'Datastore.getCollectedAssets': this.getCollectedAssets,
            'Datastore.rerunExtractor': this.rerunExtractor,
            'DevtoolsBackdoor.toggleInspectElementMode': this.toggleInspectElementMode,
            'DevtoolsBackdoor.highlightNode': this.highlightNode,
            'DevtoolsBackdoor.hideHighlight': this.hideHighlight,
            'DevtoolsBackdoor.generateQuerySelector': this.generateQuerySelector,
        };
        this.sessionId = db.sessionId;
        this.chromeAliveWindowController = new ChromeAliveWindowController_1.default(this.sessionId, devtoolsConnection, this.sendApiEvent);
        this.logger = log.createChild(module, { sessionId: this.sessionId });
        this.scriptInvocationMeta = options.scriptInvocationMeta;
        this.worldHeroSessionIds.add(this.sessionId);
        this.resourcesWatch = new SessionResourcesWatch_1.default(db, this.events);
        this.events.on(this.resourcesWatch, 'resource', this.sendApiEvent.bind(this, 'Session.resource'));
        this.timetravelPlayer = new TimetravelPlayer_1.default(db, this);
        this.events.on(this.timetravelPlayer, 'new-tick-command', this.sendCommandFocusedEvent);
        this.events.on(this.timetravelPlayer, 'new-paint-index', this.sendPaintIndexEvent);
        this.events.on(this.timetravelPlayer, 'new-offset', this.sendTimetravelOffset);
        this.selectorRecommendations = new SelectorRecommendations_1.default(this.scriptInvocationMeta);
        if (this.options.input) {
            this.inputBytes = Buffer.byteLength(JSON.stringify(this.options.input));
        }
        this.sourceCodeTimeline = new SourceCodeTimeline_1.default(this.scriptInvocationMeta.entrypoint, datastoresDir);
        if (this.sourceCodeTimeline.entrypoint.endsWith('.ts') ||
            this.scriptInvocationMeta.entrypoint.endsWith('.ts')) {
            this.scriptEntrypointTs = this.sourceCodeTimeline.entrypoint;
        }
        const sourceCode = this.sourceCodeTimeline;
        this.events.on(sourceCode, 'command', this.sendApiEvent.bind(this, 'Command.updated'));
        this.events.on(sourceCode, 'source', this.sendApiEvent.bind(this, 'SourceCode.updated'));
        if (Fs.existsSync(this.sourceCodeTimeline.entrypoint)) {
            this.scriptLastModifiedTime = Fs.statSync(this.scriptInvocationMeta.entrypoint)?.mtimeMs;
            this.watchHandle = Fs.watch(this.scriptInvocationMeta.entrypoint, {
                persistent: false,
            }, this.onScriptEntrypointUpdated);
        }
    }
    bindLiveSession(heroSession) {
        this.playbackState = 'running';
        this.liveSession = heroSession;
        this.sourceCodeTimeline.listen(heroSession);
        this.events.on(heroSession, 'kept-alive', this.onHeroSessionKeptAlive);
        this.events.on(heroSession, 'resumed', this.onHeroSessionResumed);
        this.events.on(heroSession, 'closed', this.onHeroSessionClosed);
        this.events.on(heroSession, 'output', this.onOutputUpdated);
        this.events.on(heroSession, 'collected-asset', this.onCollectedAsset);
        this.events.on(heroSession, 'tab-created', this.onTabCreated);
        this.events.on(heroSession.commands, 'start', this.onCommandStarted);
        this.events.on(heroSession.commands, 'pause', this.onCommandsPaused);
        this.events.on(heroSession.commands, 'resume', this.onCommandsResumed);
        this.timelineWatch = new TimelineWatch_1.default(heroSession, {
            extendAfterCommands: 1e3,
            extendAfterLoadStatus: {
                status: Location_1.LoadStatus.PaintingStable,
                msAfterStatus: 2e3,
            },
        });
        this.events.on(this.timelineWatch, 'updated', () => this.sendActiveSession());
    }
    loadTimelineTicks() {
        const ticks = new TimetravelTicks_1.default(this.db);
        const commandTimeline = CommandTimeline_1.default.fromDb(this.db);
        let domRecordings;
        if (this.liveSession) {
            domRecordings = Object.entries(this.mirrorPagesByTabId).map(([tabId, mirrorPage]) => {
                return { tabId: Number(tabId), domRecording: mirrorPage.domRecording };
            });
        }
        else {
            domRecordings = TimetravelTicks_1.default.loadDomRecording(this.db);
        }
        return ticks.load(domRecordings, commandTimeline);
    }
    async loadFromDb() {
        this.sourceCodeTimeline.loadCommands(this.db.commands.loadHistory());
        const network = await MirrorNetwork_1.default.createFromSessionDb(this.db);
        for (const resource of this.db.resources.all()) {
            void this.resourcesWatch
                .onTabResource(resource.tabId, await this.db.resources.getMeta(resource.id, false))
                .catch(() => null);
        }
        const timelineTicks = this.loadTimelineTicks();
        for (const { tabId, domRecording } of timelineTicks) {
            const mirrorPage = new MirrorPage_1.default(network, domRecording);
            mirrorPage.showChromeInteractions = true;
            await this.addReplayTab(tabId, mirrorPage);
        }
        await this.timetravelPlayer.setTabState(timelineTicks);
        this.onFirstTab.resolve();
        const activeTab = await this.timetravelPlayer.loadTab();
        if (activeTab) {
            activeTab.currentTimelineOffsetPct = -1;
            activeTab.currentTickIndex = -1;
            await activeTab.loadTick(0);
        }
        const output = this.db.output.all();
        this.onOutputUpdated({ changes: output });
    }
    setResuming(newSessionId) {
        this.restartingSessionId = newSessionId;
        this.sendApiEvent('Session.loading');
        this.events.once(this, 'Session.updated', () => {
            this.sendApiEvent('Session.loaded');
        });
    }
    addConnection(transport, request) {
        if (request.url.includes('/devtools')) {
            this.replayTransport = transport;
            this.events.once(transport, 'disconnected', () => {
                this.replayTransport = null;
            });
            return;
        }
        const connection = new ConnectionToClient_1.default(transport, this.apiHandlers);
        this.connections.push(connection);
        this.logger.info('ChromeAlive! Ws Connected');
        this.events.on(connection, 'request', msg => {
            this.logger.stats(`${msg.request.command} (${msg.request?.messageId})`, {
                request: msg.request,
                sessionId: null,
            });
        });
        this.events.on(connection, 'event', msg => {
            this.logger.stats(msg.event.eventType, {
                ...msg,
                sessionId: null,
            });
        });
        this.events.on(connection, 'response', msg => {
            this.logger.info(`${msg.request.command} response (${msg.request?.messageId})`, {
                response: msg.response,
                sessionId: null,
            });
        });
        this.events.once(connection, 'disconnected', () => {
            connection.removeAllListeners();
            const idx = this.connections.indexOf(connection);
            if (idx >= 0)
                this.connections.splice(idx, 1);
        });
        setImmediate(() => {
            connection.sendEvent({ eventType: 'Session.updated', data: this.toHeroSessionEvent() });
            connection.sendEvent({ eventType: 'Datastore.output', data: this.getDatastoreOutput() });
        });
        return connection;
    }
    getMirrorPage(tabId) {
        return Promise.resolve(this.mirrorPagesByTabId[tabId]);
    }
    onMultiverseSession(session) {
        this.worldHeroSessionIds.add(session.id);
        this.sendActiveSession();
    }
    bindExtractor(extractorSession) {
        const evt = this.events.on(extractorSession, 'output', this.onOutputUpdated);
        this.events.once(extractorSession, 'closed', () => this.events.off(evt));
    }
    relaunchSession(startLocation) {
        if (startLocation === 'sessionStart') {
            // will automatically send out a restarting playback state
            SourceMapSupport_1.SourceMapSupport.resetCache();
        }
        const script = this.scriptInvocationMeta.entrypoint;
        const execPath = this.scriptInvocationMeta.execPath;
        const execArgv = this.scriptInvocationMeta.execArgv ?? [];
        if (execPath.includes('Electron') || execPath.includes('Ulixee.')) {
            throw new Error("Can't restart a Datastore yet!");
        }
        const args = [
            `--resumeSessionStartLocation="${startLocation}"`,
            `--resumeSessionId="${this.sessionId}"`,
            '--showChromeAlive',
        ];
        if (startLocation === 'extraction') {
            args.length = 0;
            this.resetExtraction();
            args.push(`--replaySessionId="${this.sessionId}"`, '--mode="browserless"');
        }
        try {
            this.logger.info('Relaunch Session', { execPath, args: [...execArgv, script, ...args] });
            const child = (0, child_process_1.spawn)(execPath, [...execArgv, script, ...args], {
                cwd: this.scriptInvocationMeta.workingDirectory,
                stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
                env: { ...process.env, ULX_CLI_NOPROMPT: 'true' },
            });
            child.stderr.setEncoding('utf8');
            child.stdout.setEncoding('utf8');
            const session = this.liveSession;
            if (session) {
                this.events.on(child.stderr, 'data', msg => {
                    session.awaitedEventEmitter.emit('rerun-stderr', msg);
                });
                this.events.on(child.stdout, 'data', msg => {
                    session.awaitedEventEmitter.emit('rerun-stdout', msg);
                });
            }
        }
        catch (error) {
            this.logger.error('ERROR resuming session', { error });
            return error;
        }
    }
    toHeroSessionEvent() {
        const commandTimeline = CommandTimeline_1.default.fromDb(this.db);
        const db = this.db;
        const mainFrameIds = db.frames.mainFrameIds();
        const urls = [];
        const loadStatusLookups = [
            [Location_1.LoadStatus.HttpRequested, 'Http Requested'],
            [Location_1.LoadStatus.JavascriptReady, 'Document Open'],
        ];
        const urlChangeTimestamps = [];
        for (const nav of commandTimeline.loadedNavigations) {
            if (!mainFrameIds.has(nav.frameId))
                continue;
            const urlOffset = urls.length === 0 ? 0 : commandTimeline.getTimelineOffsetForTimestamp(nav.initiatedTime);
            if (urlOffset === -1)
                continue;
            const entry = {
                tabId: nav.tabId,
                url: nav.finalUrl ?? nav.requestedUrl,
                offsetPercent: urlOffset,
                navigationId: nav.id,
                loadStatusOffsets: [],
            };
            urls.push(entry);
            for (const [loadStatus, name] of loadStatusLookups) {
                const timestamp = nav.statusChanges.get(loadStatus);
                const offsetPercent = commandTimeline.getTimelineOffsetForTimestamp(timestamp);
                if (loadStatus === Location_1.LoadStatus.HttpResponded) {
                    urlChangeTimestamps.push(nav.initiatedTime);
                }
                if (offsetPercent !== -1) {
                    entry.loadStatusOffsets.push({
                        timestamp,
                        loadStatus: loadStatus,
                        status: name,
                        offsetPercent,
                    });
                }
            }
        }
        const paintEvents = [];
        let domChangeForUrl = 0;
        for (const [timestamp, domChanges] of db.domChanges.countByTimestamp) {
            // if we got back the response, reset our counter
            if (urlChangeTimestamps.length && timestamp > urlChangeTimestamps[0]) {
                urlChangeTimestamps.shift();
                domChangeForUrl = 0;
            }
            domChangeForUrl += domChanges;
            const offsetPercent = commandTimeline.getTimelineOffsetForTimestamp(timestamp);
            if (offsetPercent === -1)
                continue;
            paintEvents.push({
                domChanges: domChangeForUrl,
                offsetPercent,
            });
        }
        this.lastTimelineMetadata = {
            urls,
            paintEvents,
            screenshots: [],
            storageEvents: [],
        };
        return {
            heroSessionId: this.sessionId,
            dbPath: this.db.path,
            startTime: commandTimeline.startTime,
            endTime: commandTimeline.endTime,
            runtimeMs: commandTimeline.runtimeMs,
            inputBytes: this.inputBytes,
            playbackState: this.playbackState,
            scriptEntrypoint: this.scriptInvocationMeta.entrypoint,
            scriptEntrypointTs: this.scriptEntrypointTs,
            scriptLastModifiedTime: this.scriptLastModifiedTime,
            timeline: this.lastTimelineMetadata,
        };
    }
    getSourceCodeAtCommandId(commandId) {
        const command = this.db.commands.loadHistory().find(x => x.id === commandId);
        if (!command)
            return [];
        return command.callsite.map(x => SourceLoader_1.default.getSource(x)).filter(Boolean);
    }
    addSourceCodeLocation(record) {
        record.sourcecode = this.getSourceCodeAtCommandId(record.commandId);
    }
    onCollectedAsset(event) {
        const sendEvent = {};
        if (event.type === 'resource') {
            sendEvent.detachedResource = event.asset;
            this.addSourceCodeLocation(sendEvent.detachedResource);
        }
        if (event.type === 'element') {
            sendEvent.detachedElement = event.asset;
            this.addSourceCodeLocation(sendEvent.detachedElement);
        }
        if (event.type === 'snippet') {
            sendEvent.snippet = event.asset;
            this.addSourceCodeLocation(sendEvent.snippet);
        }
        this.sendDatastoreCollectedAssetsEvent(sendEvent);
    }
    onTabCreated(event) {
        const { tab } = event;
        this.onFirstTab.resolve();
        this.events.on(tab, 'page-events', this.sendDomRecordingUpdates.bind(this, tab));
        this.events.on(tab, 'page-events', () => (this.timetravelPlayer.shouldReloadTicks = true));
        this.events.on(event.tab, 'resource', this.onTabResource.bind(this, event.tab.id));
        const mirrorPage = tab.createMirrorPage(false);
        mirrorPage.showChromeInteractions = true;
        void this.addReplayTab(tab.id, mirrorPage);
    }
    async addReplayTab(tabId, mirrorPage) {
        const isFirstTab = Object.keys(this.mirrorPagesByTabId).length === 0;
        this.mirrorPagesByTabId[tabId] = mirrorPage;
        try {
            this.sendApiEvent('Session.tabCreated', { tabId });
            const page = await this.chromeAliveWindowController.waitForPageWithHeroTabId(tabId);
            await mirrorPage.attachToPage(page, this.sessionId);
            if (isFirstTab) {
                await this.sendApiEvent('Session.loaded');
                await this.openMode({ mode: this.liveSession ? 'Live' : 'Timetravel' });
            }
        }
        catch (error) {
            this.logger.error('ERROR setting up mirrorPage', { error, tabId });
        }
    }
    sendDomRecordingUpdates(tab, events) {
        if (!events.records.domChanges?.length)
            return;
        const timestamp = this.lastDomChangesByTabId[tab.id];
        const domRecording = tab.mirrorPage.getDomRecordingSince(timestamp);
        this.lastDomChangesByTabId[tab.id] =
            domRecording.paintEvents[domRecording.paintEvents.length - 1].timestamp;
        this.refreshLiveMirrorPage(tab.id).catch(console.error);
        this.sendApiEvent('Dom.updated', {
            paintEvents: domRecording.paintEvents.map(x => x.changeEvents),
            framesById: tab.session.db.frames.framesById,
        });
    }
    async refreshLiveMirrorPage(tabId, force = false) {
        const now = Date.now();
        if (!force && this.mirrorPagePauseRefreshing) {
            clearTimeout(this.mirrorRefreshTimeout);
            this.mirrorRefreshTimeout = setTimeout(this.refreshLiveMirrorPage.bind(this, tabId), 1e3).unref();
            return;
        }
        if (!force && this.mirrorRefreshLastUpdated && now - this.mirrorRefreshLastUpdated < 100) {
            if (!this.mirrorRefreshTimeout) {
                this.mirrorRefreshTimeout = setTimeout(this.refreshLiveMirrorPage.bind(this, tabId), now - this.mirrorRefreshLastUpdated).unref();
                return;
            }
        }
        clearTimeout(this.mirrorRefreshTimeout);
        this.mirrorRefreshTimeout = null;
        this.mirrorRefreshLastUpdated = now;
        try {
            await this.chromeAliveWindowController.waitForPageWithHeroTabId(tabId);
            await this.mirrorPagesByTabId[tabId].load();
        }
        catch (error) {
            if (!(error instanceof IPendingWaitEvent_1.CanceledPromiseError))
                this.logger.error('ERROR loading mirror page to latest', { error });
        }
    }
    async getDomRecording(tabId) {
        tabId ??=
            this.timetravelPlayer.activeTabId ?? Number(Object.keys(this.mirrorPagesByTabId)[0] ?? 1);
        const mirrorPage = await this.getMirrorPage(tabId);
        return {
            ...mirrorPage?.domRecording,
            framesById: this.db.frames.framesById,
        };
    }
    /// ////// API ROUTING /////////////
    getScreenshot() {
        throw new Error('Not implemented');
    }
    load() {
        return Promise.resolve(this.toHeroSessionEvent());
    }
    async close() {
        if (this.watchHandle) {
            this.watchHandle.close();
            this.watchHandle = null;
        }
        this.sourceCodeTimeline.close();
        this.events.close();
        for (const connection of this.connections) {
            await connection.disconnect();
        }
        for (const mirrorPage of Object.values(this.mirrorPagesByTabId)) {
            mirrorPage.close().catch(console.error);
        }
        clearTimeout(this.mirrorRefreshTimeout);
        this.resourcesWatch.close();
        this.timelineWatch?.close();
        this.timetravelPlayer?.close()?.catch(console.error);
        this.emit('closed');
        this.sendApiEvent('Session.closed');
    }
    async onReplayTargetCreated(args) {
        await this.chromeAliveWindowController.addTarget(args);
    }
    async onDevtoolsTargetOpened(args) {
        await this.chromeAliveWindowController.onDevtoolsOpenedInApp(args);
    }
    async getScriptState() {
        await this.onFirstTab;
        const tab = await this.timetravelPlayer.loadTab();
        return {
            ...this.sourceCodeTimeline.getCurrentState(),
            focusedCommandId: tab?.currentTick?.commandId,
        };
    }
    getDom(args) {
        return this.getDomRecording(args?.tabId);
    }
    getMeta() {
        return this.db.session.getHeroMeta();
    }
    async getTimetravelState() {
        await this.onFirstTab;
        const activeTab = await this.timetravelPlayer.loadTab();
        const tick = activeTab?.currentTick;
        return Promise.resolve({
            activeCommandId: tick?.commandId ?? 1,
            documentLoadPaintIndex: tick?.documentLoadPaintIndex ?? -1,
            highlightPaintIndexRange: activeTab?.focusedPaintIndexes,
            percentOffset: this.mode === 'Live' ? 100 : activeTab?.currentTimelineOffsetPct ?? 0,
        });
    }
    async timetravel(args) {
        try {
            const tab = await this.timetravelPlayer.loadTab();
            await this.chromeAliveWindowController.waitForPageWithHeroTabId(tab.id);
            await tab.setFocusedOffsetRange(args.timelinePercentRange);
            tab.latestStatusMetadata = this.lastTimelineMetadata;
            if (args.playback) {
                if (tab.isPlaying)
                    tab.pause();
                else
                    await tab.play();
            }
            else if (args.step) {
                const didStep = await tab.step(args.step);
                if (!didStep && args.step === 'forward') {
                    if (this.liveSession) {
                        await this.openMode({ mode: 'Live' });
                    }
                    this.sendTimetravelOffset({
                        tabId: tab.id,
                        percentOffset: 100,
                        playback: tab.isPlaying ? 'automatic' : 'manual',
                        focusedRange: undefined,
                        url: undefined,
                    });
                    return { timelineOffsetPercent: 100 };
                }
            }
            else if (args.percentOffset !== undefined) {
                await tab.setTimelineOffset(args.percentOffset);
            }
            else if (args.commandId) {
                await tab.loadTickWithCommandId(args.commandId);
            }
            if (this.mode !== 'Timetravel') {
                await this.openMode({ mode: 'Timetravel' });
            }
            const timelineOffsetPercent = tab.currentTimelineOffsetPct;
            return { timelineOffsetPercent };
        }
        catch (err) {
            if (err instanceof IPendingWaitEvent_1.CanceledPromiseError) {
                return { timelineOffsetPercent: 100 };
            }
            throw err;
        }
    }
    async openMode(args) {
        try {
            const mode = args.mode;
            this.isSearchingTimetravel = false;
            if (mode === 'Finder') {
                // if coming from timetravel, we'll use the timetravel player
                if (this.mode === 'Timetravel') {
                    this.isSearchingTimetravel = true;
                }
            }
            this.mode = mode;
            this.sendAppModeEvent(args.position, args.trigger);
            if (this.mode === 'Finder') {
                await this.chromeAliveWindowController.showElementsPanel();
            }
        }
        catch (err) {
            console.error('ERROR opening player mode %s', args.mode, err);
        }
    }
    pause() {
        this.liveSession?.pauseCommands().catch(() => null);
    }
    async resume(args) {
        if (args.startLocation === 'currentLocation') {
            this.liveSession?.resumeCommands().catch(() => null);
            return { success: true };
        }
        const error = await this.relaunchSession(args.startLocation);
        return {
            success: !error,
            error,
        };
    }
    searchResources(args) {
        const query = args.query;
        if (!this.lastTimelineMetadata)
            this.toHeroSessionEvent();
        const metadata = this.lastTimelineMetadata;
        const lastUrl = metadata.urls[metadata.urls.length - 1];
        const commandTimeline = CommandTimeline_1.default.fromDb(this.db);
        const tabId = lastUrl.tabId;
        const searchingContext = {
            baseTime: commandTimeline.startTime,
            startTime: commandTimeline.startTime,
            tabId,
            endTime: commandTimeline.endTime,
            documentUrl: undefined,
        };
        return Promise.resolve({
            resources: this.resourcesWatch.search(query, searchingContext),
        });
    }
    async searchDom(args) {
        const query = args.query;
        if (!this.lastTimelineMetadata)
            this.toHeroSessionEvent();
        const metadata = this.lastTimelineMetadata;
        const lastUrl = metadata.urls[metadata.urls.length - 1];
        const commandTimeline = CommandTimeline_1.default.fromDb(this.db);
        const lastNavigation = commandTimeline.navigationsById.get(lastUrl.navigationId);
        let tabId = lastUrl.tabId;
        let startTime = lastNavigation.statusChanges.get('HttpRequested') ??
            lastNavigation.statusChanges.get('HttpResponded');
        let endTime = commandTimeline.endTime;
        let documentUrl = lastNavigation.finalUrl ?? lastNavigation.requestedUrl;
        if (this.isSearchingTimetravel) {
            const tab = await this.timetravelPlayer.loadTab(tabId);
            tabId = tab.id;
            documentUrl = tab.currentTick.documentUrl;
            if (!tab.focusedOffsetRange) {
                const documentLoadTime = tab.getPaintEventAtIndex(tab.currentTick.documentLoadPaintIndex)?.timestamp;
                if (documentLoadTime)
                    startTime = documentLoadTime;
                endTime = tab.currentTick.timestamp;
            }
            else {
                const focusedTicks = tab.focusedPaintIndexes;
                startTime = tab.getPaintEventAtIndex(focusedTicks[0])?.timestamp;
                endTime = tab.getPaintEventAtIndex(focusedTicks[1])?.timestamp;
            }
        }
        const searchingContext = {
            baseTime: commandTimeline.startTime,
            startTime,
            tabId,
            endTime,
            documentUrl,
        };
        return {
            searchingContext,
            elements: await this.devtoolsBackdoorModule.searchDom(query),
        };
    }
    async getResourceDetails(id) {
        const [body, postData] = await Promise.all([
            this.db.resources.getResourceBodyById(id, true),
            this.db.resources.getResourcePostDataById(id),
        ]);
        const resource = this.resourcesWatch.resourcesById[id];
        const contentType = resource.responseHeaders?.['content-type'] ?? resource.responseHeaders?.['Content-Type'];
        const responseBody = body && resource.type === 'Image' && contentType
            ? `data:${contentType}; base64,${body?.toString('base64')}`
            : body?.toString();
        return { postBody: postData?.toString() ?? '', responseBody, id };
    }
    getResources() {
        return Promise.resolve(Object.values(this.resourcesWatch.resourcesById));
    }
    async getCollectedAssets() {
        const assetNames = await DetachedAssets_1.default.getNames(this.db);
        const result = {
            detachedElements: [],
            detachedResources: [],
            snippets: [],
        };
        for (const name of assetNames.elements) {
            const elements = DetachedAssets_1.default.getElements(this.db, name);
            for (const element of elements) {
                this.addSourceCodeLocation(element);
                result.detachedElements.push(element);
            }
        }
        for (const name of assetNames.resources) {
            const resources = await DetachedAssets_1.default.getResources(this.db, name);
            for (const resource of resources) {
                this.addSourceCodeLocation(resource);
                result.detachedResources.push(resource);
            }
        }
        for (const name of assetNames.snippets) {
            const snippets = DetachedAssets_1.default.getSnippets(this.db, name);
            for (const snippet of snippets) {
                this.addSourceCodeLocation(snippet);
                result.snippets.push(snippet);
            }
        }
        return result;
    }
    getDatastoreOutput() {
        return (this.outputRebuilder.getLatestSnapshot() ?? {
            bytes: 0,
            output: null,
            changes: [],
        });
    }
    async rerunExtractor() {
        const error = await this.relaunchSession('extraction');
        return {
            success: !error,
            error,
        };
    }
    async toggleInspectElementMode() {
        try {
            await this.devtoolsBackdoorModule.toggleInspectElementMode();
        }
        catch (error) {
            console.error('ERROR toggleInspectElementMode', error);
        }
    }
    async highlightNode(id) {
        try {
            await this.elementsModule.highlightNode(id);
        }
        catch (error) {
            console.error('ERROR highlightNode', error);
        }
    }
    async hideHighlight() {
        try {
            await this.elementsModule.hideHighlight();
        }
        catch (error) {
            console.error('ERROR hideHighlight', error);
        }
    }
    async generateQuerySelector(id) {
        try {
            const selectorMap = await this.elementsModule.generateQuerySelector(id);
            const activePageUrl = (await this.timetravelPlayer.loadTab())?.mirrorPage.page.mainFrame.url;
            void this.selectorRecommendations
                .save(selectorMap, activePageUrl)
                .catch(err => console.error('ERROR saving selector map', err));
            selectorMap.topMatches = selectorMap.topMatches.slice(0, 50);
            return selectorMap;
        }
        catch (error) {
            console.error('ERROR generateQuerySelector', error);
            throw error;
        }
    }
    async onTabResource(tabId, resource) {
        await this.resourcesWatch.onTabResource(tabId, resource);
    }
    async onScriptEntrypointUpdated(action) {
        if (action !== 'change')
            return;
        const stats = await Fs.promises.stat(this.scriptInvocationMeta.entrypoint);
        this.scriptLastModifiedTime = stats.mtimeMs;
        this.hasScriptUpdatesSinceLastRun = true;
        this.sendActiveSession();
    }
    onHeroSessionResumed() {
        this.playbackState = 'running';
        this.outputRebuilder = new OutputRebuilder_1.default();
        this.sourceCodeTimeline.clearCache();
        this.mirrorPagePauseRefreshing = false;
        this.hasScriptUpdatesSinceLastRun = false;
        this.sendActiveSession();
        this.sendDatastoreUpdatedEvent();
    }
    onCommandStarted() {
        if (this.mode === 'Live') {
            this.timetravelPlayer.shouldReloadTicks = true;
        }
    }
    onCommandsPaused() {
        this.playbackState = 'paused';
        this.sendActiveSession();
    }
    onCommandsResumed() {
        this.playbackState = 'running';
        this.sendActiveSession();
    }
    onHeroSessionClosed() {
        this.playbackState = 'finished';
        this.mirrorPagePauseRefreshing = true;
        this.sendActiveSession();
    }
    onHeroSessionKeptAlive(event) {
        this.playbackState = 'finished';
        this.mirrorPagePauseRefreshing = true;
        this.sendActiveSession();
        event.message = `ChromeAlive! has assumed control of your script. You can make changes to your script and re-run from the ChromeAlive interface.`;
    }
    resetExtraction() {
        this.outputRebuilder = new OutputRebuilder_1.default();
        this.sendDatastoreUpdatedEvent();
    }
    onOutputUpdated(event) {
        this.outputRebuilder.applyChanges(event.changes);
        this.sendDatastoreUpdatedEvent();
    }
    sendCommandFocusedEvent(event) {
        this.sendDatastoreUpdatedEvent();
        this.sendApiEvent('Command.focused', event);
    }
    sendTimetravelOffset(event) {
        this.sendApiEvent('Session.timetravel', event);
    }
    sendPaintIndexEvent(event) {
        this.sendApiEvent('Dom.focus', {
            highlightPaintIndexRange: event.paintIndexRange,
            documentLoadPaintIndex: event.documentLoadPaintIndex,
        });
    }
    sendActiveSession() {
        this.sendApiEvent('Session.updated', this.toHeroSessionEvent());
    }
    sendDatastoreUpdatedEvent() {
        this.sendApiEvent('Datastore.output', this.getDatastoreOutput());
    }
    sendDatastoreCollectedAssetsEvent(event) {
        this.sendApiEvent('Datastore.collected-asset', event);
    }
    sendAppModeEvent(position, trigger) {
        this.sendApiEvent('Session.appMode', { mode: this.mode, position, trigger });
    }
    sendApiEvent(eventType, data = null) {
        for (const connection of this.connections) {
            connection.sendEvent({ eventType, data });
        }
    }
}
exports.default = SessionController;
//# sourceMappingURL=SessionController.js.map