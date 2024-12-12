import QueryLogTable from './QueryLogTable';
export default class QueryLogDb {
    readonly logTable: QueryLogTable;
    private db;
    constructor(baseDir: string);
    close(): void;
}
