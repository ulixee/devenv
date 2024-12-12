export default interface ISessionAppModeEvent {
    mode: 'Live' | 'Timetravel' | 'Input' | 'Output' | 'Reliability' | 'Finder';
    position?: {
        x: number;
        y: number;
    };
    trigger?: 'contextMenu';
}
