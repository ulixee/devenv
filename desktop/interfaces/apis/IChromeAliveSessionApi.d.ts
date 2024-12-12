import type { IDomRecording } from '@ulixee/hero-core/models/DomChangesTable';
import IHeroMeta from '@ulixee/hero-interfaces/IHeroMeta';
import ISessionCreateOptions from '@ulixee/hero-interfaces/ISessionCreateOptions';
import ICommandUpdatedEvent from '../events/ICommandUpdatedEvent';
import ISessionAppModeEvent from '../events/ISessionAppModeEvent';
import ISessionDomSearchResult from '../ISessionDomSearchResult';
import IHeroSessionUpdatedEvent from '../events/IHeroSessionUpdatedEvent';
import IResourceOverview from '../IResourceOverview';
import IResourceSearchResult from '../IResourceSearchResult';
export interface ISessionResumeArgs {
    startLocation: ISessionCreateOptions['resumeSessionStartLocation'];
    startFromNavigationId?: number;
}
export default interface IChromeAliveSessionApi {
    load(): Promise<IHeroSessionUpdatedEvent>;
    close(): Promise<void>;
    pause(): void;
    resume(args: ISessionResumeArgs): Promise<{
        success: boolean;
        error?: Error;
    }>;
    getScreenshot(args: {
        tabId: number;
        timestamp: number;
    }): {
        imageBase64: string;
    };
    getDom(args: {
        tabId?: number;
    }): Promise<IDomRecording & {
        framesById: {
            [id: number]: {
                parentId: number;
                domNodeId: number;
            };
        };
    }>;
    getMeta(): IHeroMeta;
    getScriptState(args: {
        tabId?: number;
    }): Promise<{
        commandsById: Record<number, ICommandUpdatedEvent>;
        sourceFileLines: Record<string, string[]>;
        focusedCommandId: number;
    }>;
    timetravel(args: {
        commandId?: number;
        percentOffset?: number;
        playback?: 'automatic' | 'manual';
        timelinePercentRange?: [start: number, end: number];
        step?: 'forward' | 'back';
    }): Promise<{
        timelineOffsetPercent: number;
    }>;
    getTimetravelState(): Promise<{
        percentOffset: number;
        activeCommandId: number;
        highlightPaintIndexRange: [start: number, end: number];
        documentLoadPaintIndex: number;
    }>;
    getResources(): Promise<IResourceOverview[]>;
    getResourceDetails(id: number): Promise<{
        id: number;
        postBody: string;
        responseBody: string;
    }>;
    openMode(args: {
        mode: ISessionAppModeEvent['mode'];
        trigger?: 'contextMenu';
        position?: {
            x: number;
            y: number;
        };
    }): void;
    searchDom(args: {
        query: string;
    }): Promise<ISessionDomSearchResult>;
    searchResources(args: {
        query: string;
    }): Promise<{
        resources: IResourceSearchResult[];
    }>;
    replayTargetCreated(args: {
        targetId: string;
        browserContextId: string;
        heroTabId: number;
        chromeTabId: number;
        isReconnect?: boolean;
    }): Promise<void>;
    devtoolsTargetOpened(args: {
        targetId: string;
        browserContextId: string;
        isReconnect?: boolean;
    }): Promise<void>;
}
