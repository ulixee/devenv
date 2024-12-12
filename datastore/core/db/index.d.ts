import DatastoreVersionsTable from './DatastoreVersionsTable';
export default class DatastoresDb {
    readonly versions: DatastoreVersionsTable;
    private db;
    constructor(baseDir: string);
    close(): void;
}
