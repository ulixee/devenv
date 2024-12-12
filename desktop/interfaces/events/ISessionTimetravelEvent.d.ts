export default interface ISessionTimetravelEvent {
    percentOffset: number;
    playback: 'automatic' | 'manual';
    focusedRange: [number, number];
    tabId: number;
    url: string;
}
