export default interface IQueryLogEntry {
    queryId: string;
    datastoreId: string;
    version: string;
    date: Date;
    query: string;
    input: any;
    affiliateId: string;
    outputs: any[];
    error?: Error;
    milliseconds: number;
    bytes: number;
    microgons: bigint;
    creditId?: string;
    channelHoldId?: string;
    cloudNodeHost: string;
    cloudNodeIdentity?: string;
}
