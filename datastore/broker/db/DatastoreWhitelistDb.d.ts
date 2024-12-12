export default class DatabrokerDb {
    private db;
    private whitelistQuery;
    constructor(baseDir: string);
    close(): void;
    add(domain: string): void;
    delete(domain: string): void;
    list(): string[];
    isWhitelisted(_datastoreId: string, domain: string): boolean;
}
