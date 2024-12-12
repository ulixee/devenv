import { Database as SqliteDatabase } from 'better-sqlite3';
export default class UsersTable {
    private db;
    private readonly insertQuery;
    private readonly getOrganizationQuery;
    constructor(db: SqliteDatabase);
    create(identity: string, name: string, organizationId: string): void;
    editName(identity: string, name: string): void;
    getOrganizationId(identity: string): string;
    count(): number;
    list(): IUserRecord[];
    delete(identity: string): void;
    listByOrganization(organizationId: string): IUserRecord[];
}
export interface IUserRecord {
    identity: string;
    name?: string;
    organizationId: string;
    modified: number;
}
