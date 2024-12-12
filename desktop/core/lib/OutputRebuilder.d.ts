import { IOutputChangeRecord } from '@ulixee/hero-core/models/OutputTable';
export interface IOutputSnapshot {
    output: any;
    bytes: number;
    changes: {
        type: string;
        path: string;
    }[];
}
export default class OutputRebuilder {
    private snapshotsByCommandId;
    private latestCommandId;
    getLatestSnapshot(commandId?: number): IOutputSnapshot;
    applyChanges(changes: IOutputChangeRecord[]): void;
    private getSnapshotAtPoint;
}
