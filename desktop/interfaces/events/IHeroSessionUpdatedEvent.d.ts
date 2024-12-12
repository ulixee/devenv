import ITimelineMetadata from '@ulixee/hero-interfaces/ITimelineMetadata';
export default interface IHeroSessionUpdatedEvent {
    heroSessionId: string;
    scriptEntrypoint: string;
    scriptEntrypointTs?: string;
    dbPath: string;
    startTime: number;
    endTime?: number;
    scriptLastModifiedTime: number;
    inputBytes: number;
    playbackState: 'running' | 'paused' | 'finished' | 'restarting';
    runtimeMs: number;
    timeline: ITimelineMetadata;
}
