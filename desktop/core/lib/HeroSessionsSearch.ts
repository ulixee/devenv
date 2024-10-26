import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import TypeSerializer from '@ulixee/commons/lib/TypeSerializer';
import { bindFunctions } from '@ulixee/commons/lib/utils';
import {
  IHeroSessionsListResult,
  IHeroSessionsSearchResult,
} from '@ulixee/desktop-interfaces/apis/IHeroSessionsApi';
import HeroCore, { Session as HeroSession } from '@ulixee/hero-core';
import CommandFormatter from '@ulixee/hero-core/lib/CommandFormatter';
import FuseJs from 'fuse.js';
import OutputRebuilder from './OutputRebuilder';

const Fuse = require('fuse.js/dist/fuse.common.js');

export default class HeroSessionsSearch extends TypedEventEmitter<{
  update: IHeroSessionsListResult[];
}> {
  private sessions: IHeroSessionsListResult[] = [];
  private commandsBySessionId: { [sessionId: string]: { id: number; label: string }[] } = {};

  private searchIndex: FuseJs<{
    id: string;
    commands: { id: number; label: string }[];
    logs: string[];
  }> = new Fuse([], {
    isCaseSensitive: false,
    findAllMatches: true,
    useExtendedSearch: true,
    minMatchCharLength: 3,
    keys: ['commands.label', 'logs'],
    ignoreLocation: true,
    ignoreFieldNorm: true,
    includeMatches: true,
  });

  private hasLoaded = false;
  private events = new EventSubscriber();

  constructor(private heroCore: HeroCore) {
    super();
    bindFunctions(this);
  }

  async close(): Promise<void> {
    this.events.off();
    await Promise.allSettled(
      this.sessions.map(x => this.heroCore.sessionRegistry.close(x.heroSessionId, false)),
    );
    this.heroCore = null;
  }

  onNewSession(heroSession: HeroSession): void {
    const id = heroSession.id;
    const scriptInvocationMeta = heroSession.options?.scriptInvocationMeta;
    const entry: IHeroSessionsListResult = {
      heroSessionId: id,
      scriptEntrypoint: this.processEntrypoint(scriptInvocationMeta?.entrypoint),
      datastore:
        scriptInvocationMeta?.runtime === 'datastore'
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
    this.events.group(
      id,
      this.events.on(heroSession, 'kept-alive', this.onHeroSessionKeptAlive.bind(this, entry)),
      this.events.on(heroSession, 'resumed', this.onHeroSessionResumed.bind(this, entry)),
      this.events.on(heroSession, 'closed', this.onHeroSessionClosed.bind(this, entry)),
    );
  }

  async list(): Promise<IHeroSessionsListResult[]> {
    if (this.hasLoaded) return this.sessions;

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

  search(query: string): Promise<IHeroSessionsSearchResult[]> {
    const finalQuery: string = query
      .split(/\s+/)
      .map(x => {
        if (!x) return null;
        if (x.match(/['^!.]+/)) return `'"${x}"`;
        return `'${x.trim()}`;
      })
      .filter(Boolean)
      .join(' | ');

    const results: IHeroSessionsSearchResult[] = [];
    const searchResults = this.searchIndex.search(finalQuery);
    for (const result of searchResults) {
      const id = result.item.id;

      const matches: IHeroSessionsSearchResult['matches'] = [];
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

  async withErrors(): Promise<IHeroSessionsListResult[]> {
    const list = await this.list();
    return list.filter(x => x.state === 'error');
  }

  private async processSession(
    sessionId: string,
    customPath?: string,
  ): Promise<IHeroSessionsListResult | undefined> {
    const sessionDb = await this.heroCore.sessionRegistry.get(sessionId, customPath);
    if (!sessionDb.isOpen) return;
    const session = sessionDb?.session?.get();
    // might not be loaded yet
    if (!session) return;

    try {
      const { id, createSessionOptions, startDate, closeDate, scriptEntrypoint } = session;
      const outputChanges = sessionDb.output.all();
      const outputRebuilder = new OutputRebuilder();
      outputRebuilder.applyChanges(outputChanges);

      const commands = sessionDb.commands.loadHistory();
      const commandLabels: { id: number; label: string }[] = [];
      let errorOnLastCommand: { id: number; error: Error; label: string };
      let state: IHeroSessionsListResult['state'] = closeDate ? 'complete' : 'running';
      const logErrors: string[] = [];

      for (const command of commands) {
        const label = CommandFormatter.toString(command);
        commandLabels.push({ id: command.id, label });
        if (command.resultType?.endsWith('Error')) {
          logErrors.push(command.result.message);
          errorOnLastCommand = {
            label,
            error: command.result,
            id: command.id,
          };
        } else if (
          command.name !== 'flush' &&
          command.name !== 'close' &&
          !command.name.includes('Listener')
        ) {
          errorOnLastCommand = null;
        }
        if (state === 'running' && command.name === 'close' && command.args[0] === false) {
          state = 'kept-alive';
        }
      }
      if (errorOnLastCommand) state = 'error';
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
        const error = TypeSerializer.parse(x.data);
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
        datastore:
          session.scriptRuntime === 'datastore'
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
    } catch (error) {
      console.warn('ERROR loading search index for Hero Replay', error, { sessionId });
    }
  }

  private processEntrypoint(scriptEntrypoint: string): string {
    const divider = scriptEntrypoint.includes('/') ? '/' : '\\';
    return scriptEntrypoint.split(divider).slice(-2).join(divider);
  }

  private onHeroSessionResumed(entry: IHeroSessionsListResult): void {
    entry.state = 'running';
    this.emit('update', [entry]);
  }

  private async onHeroSessionClosed(entry: IHeroSessionsListResult): Promise<void> {
    const update = await this.processSession(entry.heroSessionId, entry.dbPath);
    if (!update) return;
    Object.assign(entry, update);
    entry.endTime ??= new Date();
    entry.state = 'complete';

    this.emit('update', [entry]);
    this.events.endGroup(entry.heroSessionId);
  }

  private async onHeroSessionKeptAlive(entry: IHeroSessionsListResult): Promise<void> {
    const update = await this.processSession(entry.heroSessionId, entry.dbPath);
    if (!update) return;
    entry.state = 'kept-alive';
    Object.assign(entry, update);
    this.emit('update', [entry]);
  }
}
