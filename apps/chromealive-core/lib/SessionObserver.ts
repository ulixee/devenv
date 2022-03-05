import { Session as HeroSession, Tab } from '@ulixee/hero-core';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import * as Fs from 'fs';
import IScriptInstanceMeta from '@ulixee/hero-interfaces/IScriptInstanceMeta';
import { bindFunctions } from '@ulixee/commons/lib/utils';
import IHeroSessionActiveEvent from '@ulixee/apps-chromealive-interfaces/events/IHeroSessionActiveEvent';
import type { IOutputChangeRecord } from '@ulixee/hero-core/models/OutputTable';
import IDataboxUpdatedEvent from '@ulixee/apps-chromealive-interfaces/events/IDataboxUpdatedEvent';
import IAppModeEvent from '@ulixee/apps-chromealive-interfaces/events/IAppModeEvent';
import * as Path from 'path';
import { fork } from 'child_process';
import Log from '@ulixee/commons/lib/Logger';
import ISessionCreateOptions from '@ulixee/hero-interfaces/ISessionCreateOptions';
import TimelineBuilder from '@ulixee/hero-timetravel/lib/TimelineBuilder';
import TabGroupModule from './hero-plugin-modules/TabGroupModule';
import TimetravelPlayer from '@ulixee/hero-timetravel/player/TimetravelPlayer';
import ChromeAliveCore from '../index';
import TimelineRecorder from '@ulixee/hero-timetravel/lib/TimelineRecorder';
import AliveBarPositioner from './AliveBarPositioner';
import OutputRebuilder, { IOutputSnapshot } from './OutputRebuilder';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import SourceCodeTimeline from './SourceCodeTimeline';
import ISessionApi from '@ulixee/apps-chromealive-interfaces/apis/ISessionApi';
import VuePage from './VuePage';

const { log } = Log(module);

export default class SessionObserver extends TypedEventEmitter<{
  'hero:updated': void;
  'databox:updated': void;
  'app:mode': void;
  closed: void;
}> {
  public mode: IAppModeEvent['mode'] = 'live';
  public playbackState: IHeroSessionActiveEvent['playbackState'] = 'running';
  public readonly timelineBuilder: TimelineBuilder;

  public readonly timetravelPlayer: TimetravelPlayer;
  public readonly timelineRecorder: TimelineRecorder;
  public readonly scriptInstanceMeta: IScriptInstanceMeta;
  public readonly worldHeroSessionIds = new Set<string>();
  public readonly sourceCodeTimeline: SourceCodeTimeline;

  private sessionHasChangesRequiringRestart = false;
  private extraTab: VuePage;

  private scriptLastModifiedTime: number;
  private outputRebuilder = new OutputRebuilder();
  private hasScriptUpdatesSinceLastRun = false;
  private watchHandle: Fs.FSWatcher;
  private events = new EventSubscriber();
  private readonly lastDomChangesByTabId: Record<number, number> = {};

  constructor(public readonly heroSession: HeroSession) {
    super();
    bindFunctions(this);
    this.logger = log.createChild(module, { sessionId: heroSession.id });
    this.scriptInstanceMeta = heroSession.options.scriptInstanceMeta;
    this.worldHeroSessionIds.add(heroSession.id);

    this.events.on(this.heroSession, 'kept-alive', this.onHeroSessionKeptAlive);
    this.events.on(this.heroSession, 'resumed', this.onHeroSessionResumed);
    this.events.on(this.heroSession, 'closing', this.close);
    this.events.on(this.heroSession, 'output', this.onOutputUpdated);
    this.events.on(this.heroSession, 'tab-created', this.onTabCreated);

    this.timelineBuilder = new TimelineBuilder({ liveSession: heroSession });

    this.timelineRecorder = new TimelineRecorder(heroSession);
    this.events.on(this.timelineRecorder, 'updated', () => this.emit('hero:updated'));

    this.timetravelPlayer = TimetravelPlayer.create(heroSession.id, heroSession);
    this.events.on(this.timetravelPlayer, 'all-tabs-closed', this.onTimetravelClosed);
    this.events.on(this.timetravelPlayer, 'open', this.onTimetravelOpened);

    this.scriptLastModifiedTime = Fs.statSync(this.scriptInstanceMeta.entrypoint).mtimeMs;

    this.sourceCodeTimeline = new SourceCodeTimeline(heroSession);
    this.extraTab = new VuePage(heroSession, 'http://ulixee.app');

    this.watchHandle = Fs.watch(
      this.scriptInstanceMeta.entrypoint,
      {
        persistent: false,
      },
      this.onScriptEntrypointUpdated,
    );
  }

  public onMultiverseSession(session: HeroSession): void {
    this.worldHeroSessionIds.add(session.id);
    this.emit('hero:updated');
  }

  public async relaunchSession(
    startLocation: ISessionCreateOptions['sessionResume']['startLocation'],
    startNavigationId?: number,
  ): Promise<Error | undefined> {
    if (startLocation === 'sessionStart' || this.sessionHasChangesRequiringRestart) {
      ChromeAliveCore.restartingHeroSessionId = this.heroSession.id;
      AliveBarPositioner.restartingSession(this.heroSession.id);
      await this.heroSession.close(true);
    }
    const script = this.scriptInstanceMeta.entrypoint;
    const execArgv = [
      `--sessionResume.startLocation`,
      startLocation,
      `--sessionResume.sessionId`,
      this.heroSession.id,
    ];
    if (startNavigationId) {
      execArgv.push(`--sessionResume.startNavigationId`, String(startNavigationId));
    }
    if (script.endsWith('.ts')) {
      execArgv.push('-r', 'ts-node/register');
    }

    try {
      this.logger.info('Resuming session', { execArgv });
      const child = fork(script, execArgv, {
        // execArgv,
        cwd: this.scriptInstanceMeta.workingDirectory,
        stdio: ['ignore', 'inherit', 'pipe', 'ipc'],
        env: { ...process.env, HERO_CLI_NOPROMPT: 'true' },
      });
      child.stderr.setEncoding('utf-8');
      const evt = this.events.on(child.stderr, 'data', x => {
        if (x.includes('ScriptChangedNeedsRestartError')) {
          this.relaunchSession('sessionStart').catch(() => null);
        }
      });
      this.events.once(child, 'exit', () => this.events.off(evt));
    } catch (error) {
      this.logger.error('ERROR resuming session', { error });
      return error;
    }
  }

  public async openPanel(panel: Parameters<ISessionApi['openPanel']>[0]['panel']): Promise<void> {
    const path = {
      Input: '/screen-input.html',
      Output: '/screen-output.html',
      Tested: '/screen-tests.html',
    }[panel];
    await this.extraTab.open(path, `/${panel.toLowerCase()}`);
  }

  public close(): void {
    if (this.watchHandle) {
      this.watchHandle.close();
      this.watchHandle = null;
    }
    this.sourceCodeTimeline.close();

    this.events.close();
    this.timelineRecorder.close();
    this.timetravelPlayer?.close()?.catch(console.error);
    this.emit('closed');
  }

  public getScriptDetails(): Pick<
    IHeroSessionActiveEvent,
    'scriptEntrypoint' | 'scriptLastModifiedTime'
  > {
    return {
      scriptEntrypoint: this.scriptInstanceMeta.entrypoint.split(Path.sep).slice(-2).join(Path.sep),
      scriptLastModifiedTime: this.scriptLastModifiedTime,
    };
  }

  public getHeroSessionEvent(): IHeroSessionActiveEvent {
    const domStates: IHeroSessionActiveEvent['domStates'] = [];
    const timeline = this.timelineBuilder.refreshMetadata();
    const commandTimeline = this.timelineBuilder.commandTimeline;

    const currentTab = this.heroSession.getLastActiveTab();

    timeline.urls.push({
      url: currentTab?.url,
      tabId: currentTab?.id,
      navigationId: null, // don't include nav id since we want to resume session at current
      offsetPercent: 100,
      loadStatusOffsets: [],
    });

    return {
      hasWarning: false,
      run: this.heroSession.commands.resumeCounter,
      heroSessionId: this.heroSession.id,
      runtimeMs: commandTimeline.runtimeMs,
      mode: this.mode,
      playbackState: this.playbackState,
      worldHeroSessionIds: [...this.worldHeroSessionIds],
      ...this.getScriptDetails(),
      domStates,
      timeline,
    };
  }

  public getDataboxEvent(): IDataboxUpdatedEvent {
    const commandId = this.timetravelPlayer.activeCommandId;

    const output: IOutputSnapshot = this.outputRebuilder.getLatestSnapshot(commandId) ?? {
      bytes: 0,
      output: null,
      changes: [],
    };
    return {
      ...output,
    };
  }

  public get tabGroupModule(): TabGroupModule {
    return TabGroupModule.bySessionId.get(this.heroSession.id);
  }

  public async groupTabs(name: string, color: string, collapse: boolean): Promise<number> {
    const tabGroupModule = this.tabGroupModule;
    if (!tabGroupModule) return;

    const pages = [...this.heroSession.tabsById.values()].map(x => x.puppetPage);
    if (!pages.length) return;
    return await tabGroupModule.groupTabs(pages, name, color, collapse);
  }

  public async updateTabGroup(groupLive: boolean): Promise<void> {
    const tabGroupModule = this.tabGroupModule;
    if (!tabGroupModule) return;

    const pages = [...this.heroSession.tabsById.values()].map(x => x.puppetPage);
    if (!pages.length) return;

    if (groupLive === false) {
      await tabGroupModule.ungroupTabs(pages);
    } else {
      await this.groupTabs('Reopen Live', 'blue', true);
    }
  }

  public async didFocusOnPage(pageId: string, didFocus: boolean): Promise<void> {
    const isLiveTab = this.isLivePage(pageId);
    const isTimetravelTab = this.timetravelPlayer.isOwnPage(pageId) ?? false;

    // if closing time travel tab, leave
    if (isTimetravelTab && !didFocus) return;

    const didFocusOnLiveTab = isLiveTab && didFocus;
    // if time travel is opened and we focused on a live page, close it
    if (didFocusOnLiveTab && this.timetravelPlayer.isOpen) {
      await this.closeTimetravel();
    }
  }

  public async timetravel(option: {
    percentOffset?: number;
    step?: 'forward' | 'back';
    commandId?: number;
  }): Promise<{ timelineOffsetPercent: number }> {
    // set to timetravel mode in advance to prevent jumping out
    this.mode = 'timetravel';
    if (!this.timetravelPlayer.isOpen) {
      await this.updateTabGroup(true).catch(console.error);
    }
    if (option.step) {
      await this.timetravelPlayer.step(option.step);
    } else {
      let offsetPercent = option.percentOffset;
      if (option.commandId) {
        offsetPercent = await this.timetravelPlayer.findCommandPercentOffset(option.commandId);
      }
      await this.timetravelPlayer.goto(offsetPercent ?? 100);
    }

    await this.timetravelPlayer.showLoadStatus(this.timelineBuilder.lastMetadata);
    return { timelineOffsetPercent: this.timetravelPlayer.activeTab.currentTimelineOffsetPct };
  }

  public async closeTimetravel(): Promise<void> {
    await this.timetravelPlayer.close();
  }

  public async onTimetravelOpened(): Promise<void> {
    this.mode = 'timetravel';
    const events = [
      this.events.once(this.tabGroupModule, 'tab-group-opened', this.closeTimetravel),
      this.events.once(this.timetravelPlayer, 'timetravel-to-end', this.closeTimetravel),
    ];
    this.events.group('timetravel', ...events);
    await this.timetravelPlayer.activeTab.mirrorPage.page.bringToFront();
    this.emit('app:mode');
  }

  public onTabCreated(event: HeroSession['EventTypes']['tab-created']): void {
    this.events.on(event.tab, 'page-events', this.sendDomRecordingUpdates.bind(this, event.tab));
  }

  public sendDomRecordingUpdates(tab: Tab, events: Tab['EventTypes']['page-events']): void {
    if (!events.records.domChanges?.length) return;
    const timestamp = this.lastDomChangesByTabId[tab.id];
    const domRecording = tab.mirrorPage.getDomRecordingSince(timestamp);

    this.lastDomChangesByTabId[tab.id] =
      domRecording.paintEvents[domRecording.paintEvents.length - 1].timestamp;

    ChromeAliveCore.sendAppEvent('Dom.updated', {
      paintEvents: domRecording.paintEvents.map(x => x.changeEvents),
      framesById: tab.session.db.frames.framesById,
    });
  }

  public getDomRecording(tabId: number): ReturnType<ISessionApi['getDom']> {
    const tab = this.heroSession.tabsById.get(tabId) ?? this.heroSession.getLastActiveTab();
    const domRecording = {
      ...tab.mirrorPage.domRecording,
      framesById: this.heroSession.db.frames.framesById,
    };
    const last = domRecording.paintEvents[domRecording.paintEvents.length - 1];
    if (last) this.lastDomChangesByTabId[tab.id] = last.timestamp;
    return Promise.resolve(domRecording);
  }

  private async onTimetravelClosed(): Promise<void> {
    this.mode = 'live';
    this.events.endGroup('timetravel');
    await this.updateTabGroup(false).catch(console.error);
    this.emit('app:mode');
  }

  private isLivePage(pageId: string): boolean {
    for (const tab of this.heroSession.tabsById.values()) {
      if (tab.puppetPage.id === pageId) return true;
    }
    return false;
  }

  private async onScriptEntrypointUpdated(action: string): Promise<void> {
    if (action !== 'change') return;
    const stats = await Fs.promises.stat(this.scriptInstanceMeta.entrypoint);
    this.scriptLastModifiedTime = stats.mtimeMs;
    this.hasScriptUpdatesSinceLastRun = true;
    this.emit('hero:updated');
  }

  private onHeroSessionResumed(): void {
    this.playbackState = 'running';
    this.outputRebuilder = new OutputRebuilder();
    this.sourceCodeTimeline.clearCache();
    this.hasScriptUpdatesSinceLastRun = false;
    this.emit('hero:updated');
    this.emit('databox:updated');
  }

  private onHeroSessionKeptAlive(event: { message: string }): void {
    this.playbackState = 'paused';
    this.emit('hero:updated');
    event.message = `ChromeAlive! has assumed control of your script. You can make changes to your script and re-run from the ChromeAlive interface.`;
  }

  private onOutputUpdated(event: { changes: IOutputChangeRecord[] }): void {
    this.outputRebuilder.applyChanges(event.changes);
    this.emit('databox:updated');
  }
}
