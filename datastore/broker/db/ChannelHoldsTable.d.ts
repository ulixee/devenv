import { Database as SqliteDatabase } from 'better-sqlite3';
export default class ChannelHoldsTable {
    private db;
    private readonly insertQuery;
    private readonly updateSettlementQuery;
    constructor(db: SqliteDatabase);
    create(channelHold: IChannelHoldRecord): void;
    updateSettlementReturningChange(channelHoldId: string, settledMicrogons: bigint, settlementDate: number): [organizationId: string, holdAmount: bigint, change: bigint];
    count(): number;
    countOpen(): number;
    pendingBalance(): bigint;
}
export interface IChannelHoldRecord {
    channelHoldId: string;
    organizationId: string;
    createdByIdentity: string;
    domain?: string;
    heldMicrogons: bigint;
    settledMicrogons?: bigint;
    settlementDate?: number;
    created: number;
}
