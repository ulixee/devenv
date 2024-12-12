import { Database as SqliteDatabase } from 'better-sqlite3';
export default class OrganizationsTable {
    private db;
    private readonly insertQuery;
    private readonly updateNameQuery;
    private readonly debitQuery;
    private readonly grantQuery;
    private readonly settleQuery;
    private readonly getQuery;
    constructor(db: SqliteDatabase);
    create(name: string, balance: bigint): string;
    delete(organizationId: string): void;
    updateName(organizationId: string, name: string): void;
    debit(organizationId: string, amount: bigint): void;
    grant(organizationId: string, amount: bigint): void;
    settle(organizationId: string, change: bigint, debitedAmount: bigint): void;
    get(organizationId: string): IOrganizationRecord;
    count(): number;
    list(): IOrganizationRecord[];
    totalGranted(): bigint;
    totalBalance(): bigint;
}
export interface IOrganizationRecord {
    id: string;
    name?: string;
    totalGranted: bigint;
    balance: bigint;
    balanceInChannelHolds: bigint;
    modified: number;
}
