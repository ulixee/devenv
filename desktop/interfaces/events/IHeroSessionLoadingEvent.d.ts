export default interface IHeroSessionUpdatedEvent {
    scriptEntrypoint: string;
    scriptLastModifiedTime: number;
    heroSessionId: string;
    hasWarning: boolean;
    state: 'play' | 'paused';
    durationSeconds: number;
    run: number;
    loadedUrls: {
        url: string;
        offsetPercent: number;
        navigationId: number;
        tabId: number;
        hasScreenshot: boolean;
    }[];
}
