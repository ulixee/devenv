import ITimelineMetadata from '@ulixee/hero-interfaces/ITimelineMetadata';
import { IAssertionCounts } from '@ulixee/hero-interfaces/IDomStateAssertionBatch';
export default interface IDomStateUpdatedEvent {
    id: string;
    name: string;
    assertionCounts: IAssertionCounts;
    heroSessions: {
        id: string;
        isFocused: boolean;
        isRunning: boolean;
        isPrimary: boolean;
        isSpawnedWorld: boolean;
        assertionCounts: IAssertionCounts;
        timelineRange?: [start: number, end: number];
        loadingRange?: [start: number, end: number];
        timelineOffsetPercents?: [start: number, end: number];
        timeline: ITimelineMetadata;
    }[];
}
