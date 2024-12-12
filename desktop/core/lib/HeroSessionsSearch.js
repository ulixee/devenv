"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSubscriber_1 = require("@ulixee/commons/lib/EventSubscriber");
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const utils_1 = require("@ulixee/commons/lib/utils");
const CommandFormatter_1 = require("@ulixee/hero-core/lib/CommandFormatter");
const OutputRebuilder_1 = require("./OutputRebuilder");
const Fuse = require('fuse.js/dist/fuse.common.js');
class HeroSessionsSearch extends TypedEventEmitter_1.default {
    constructor(heroCore) {
        super();
        this.heroCore = heroCore;
        this.sessions = [];
        this.commandsBySessionId = {};
        this.searchIndex = new Fuse([], {
            isCaseSensitive: false,
            findAllMatches: true,
            useExtendedSearch: true,
            minMatchCharLength: 3,
            keys: ['commands.label', 'logs'],
            ignoreLocation: true,
            ignoreFieldNorm: true,
            includeMatches: true,
        });
        this.hasLoaded = false;
        this.events = new EventSubscriber_1.default();
        (0, utils_1.bindFunctions)(this);
    }
    async close() {
        this.events.off();
        await Promise.allSettled(this.sessions.map(x => this.heroCore.sessionRegistry.close(x.heroSessionId, false)));
        this.heroCore = null;
    }
    onNewSession(heroSession) {
        const id = heroSession.id;
        const scriptInvocationMeta = heroSession.options?.scriptInvocationMeta;
        const entry = {
            heroSessionId: id,
            scriptEntrypoint: this.processEntrypoint(scriptInvocationMeta?.entrypoint),
            datastore: scriptInvocationMeta?.runtime === 'datastore'
                ? {
                    datastoreId: scriptInvocationMeta.productId,
                    version: scriptInvocationMeta.version,
                    functionName: scriptInvocationMeta.entryFunction,
                    queryId: scriptInvocationMeta.runId,
                }
                : null,
            dbPath: heroSession.db.path,
            startTime: new Date(heroSession.createdTime),
            state: 'running',
            input: heroSession.options.input,
        };
        this.sessions.unshift(entry);
        this.emit('update', [entry]);
        this.events.group(id, this.events.on(heroSession, 'kept-alive', this.onHeroSessionKeptAlive.bind(this, entry)), this.events.on(heroSession, 'resumed', this.onHeroSessionResumed.bind(this, entry)), this.events.on(heroSession, 'closed', this.onHeroSessionClosed.bind(this, entry)));
    }
    async list() {
        if (this.hasLoaded)
            return this.sessions;
        const sessionIds = await this.heroCore.sessionRegistry.ids();
        for (const id of sessionIds) {
            const session = await this.processSession(id);
            if (session) {
                this.sessions.push(session);
            }
        }
        this.hasLoaded = true;
        return this.sessions;
    }
    search(query) {
        const finalQuery = query
            .split(/\s+/)
            .map(x => {
            if (!x)
                return null;
            if (x.match(/['^!.]+/))
                return `'"${x}"`;
            return `'${x.trim()}`;
        })
            .filter(Boolean)
            .join(' | ');
        const results = [];
        const searchResults = this.searchIndex.search(finalQuery);
        for (const result of searchResults) {
            const id = result.item.id;
            const matches = [];
            for (const match of result.matches) {
                matches.push({ type: 'command', preview: match.value });
            }
            results.push({
                heroSessionId: id,
                matches,
            });
        }
        return Promise.resolve(results);
    }
    async withErrors() {
        const list = await this.list();
        return list.filter(x => x.state === 'error');
    }
    async processSession(sessionId, customPath) {
        const sessionDb = await this.heroCore.sessionRegistry.get(sessionId, customPath);
        if (!sessionDb.isOpen)
            return;
        const session = sessionDb?.session?.get();
        // might not be loaded yet
        if (!session)
            return;
        try {
            const { id, createSessionOptions, startDate, closeDate, scriptEntrypoint } = session;
            const outputChanges = sessionDb.output.all();
            const outputRebuilder = new OutputRebuilder_1.default();
            outputRebuilder.applyChanges(outputChanges);
            const commands = sessionDb.commands.loadHistory();
            const commandLabels = [];
            let errorOnLastCommand;
            let state = closeDate ? 'complete' : 'running';
            const logErrors = [];
            for (const command of commands) {
                const label = CommandFormatter_1.default.toString(command);
                commandLabels.push({ id: command.id, label });
                if (command.resultType?.endsWith('Error')) {
                    logErrors.push(command.result.message);
                    errorOnLastCommand = {
                        label,
                        error: command.result,
                        id: command.id,
                    };
                }
                else if (command.name !== 'flush' &&
                    command.name !== 'close' &&
                    !command.name.includes('Listener')) {
                    errorOnLastCommand = null;
                }
                if (state === 'running' && command.name === 'close' && command.args[0] === false) {
                    state = 'kept-alive';
                }
            }
            if (errorOnLastCommand)
                state = 'error';
            this.commandsBySessionId[id] = commandLabels;
            // for (const msg of sessionDb.devtoolsMessages.all()) {
            //   if (
            //     msg.params?.includes(keyword) ||
            //     msg.result?.includes(keyword) ||
            //     msg.error?.includes(keyword)
            //   ) {
            //     didMatchDevtools = true;
            //     break;
            //   }
            // }
            sessionDb.sessionLogs.allErrors().forEach(x => {
                const error = TypeSerializer_1.default.parse(x.data);
                logErrors.push((error.clientError ?? error.error ?? error).message);
            });
            this.searchIndex.remove(x => x.id === id);
            this.searchIndex.add({
                id,
                commands: commandLabels,
                logs: logErrors,
            });
            return {
                heroSessionId: id,
                scriptEntrypoint: this.processEntrypoint(scriptEntrypoint),
                dbPath: sessionDb.path,
                startTime: new Date(startDate),
                datastore: session.scriptRuntime === 'datastore'
                    ? {
                        datastoreId: session.scriptProductId,
                        version: session.scriptVersion,
                        functionName: session.scriptEntrypointFunction,
                        queryId: session.scriptRunId,
                    }
                    : null,
                state,
                error: errorOnLastCommand ? `${errorOnLastCommand.error?.message ?? 'Error'}` : null,
                errorCommand: errorOnLastCommand ? errorOnLastCommand.label : null,
                endTime: closeDate ? new Date(closeDate) : null,
                // TODO: store input and output and return
                input: createSessionOptions.input,
                outputs: outputRebuilder.getLatestSnapshot()?.output,
            };
        }
        catch (error) {
            console.warn('ERROR loading search index for Hero Replay', error, { sessionId });
        }
    }
    processEntrypoint(scriptEntrypoint) {
        const divider = scriptEntrypoint.includes('/') ? '/' : '\\';
        return scriptEntrypoint.split(divider).slice(-2).join(divider);
    }
    onHeroSessionResumed(entry) {
        entry.state = 'running';
        this.emit('update', [entry]);
    }
    async onHeroSessionClosed(entry) {
        const update = await this.processSession(entry.heroSessionId, entry.dbPath);
        if (!update)
            return;
        Object.assign(entry, update);
        entry.endTime ??= new Date();
        entry.state = 'complete';
        this.emit('update', [entry]);
        this.events.endGroup(entry.heroSessionId);
    }
    async onHeroSessionKeptAlive(entry) {
        const update = await this.processSession(entry.heroSessionId, entry.dbPath);
        if (!update)
            return;
        entry.state = 'kept-alive';
        Object.assign(entry, update);
        this.emit('update', [entry]);
    }
}
exports.default = HeroSessionsSearch;
//# sourceMappingURL=HeroSessionsSearch.js.map