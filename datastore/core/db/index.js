"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require("better-sqlite3");
const Fs = require("fs");
const DatastoreVersionsTable_1 = require("./DatastoreVersionsTable");
const env_1 = require("../env");
class DatastoresDb {
    constructor(baseDir) {
        if (!Fs.existsSync(baseDir))
            Fs.mkdirSync(baseDir, { recursive: true });
        this.db = new Database(`${baseDir}/metadata.db`);
        if (env_1.default.enableSqliteWalMode) {
            this.db.unsafeMode(false);
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = FULL');
        }
        this.versions = new DatastoreVersionsTable_1.default(this.db);
    }
    close() {
        if (this.db?.open) {
            this.db.pragma('wal_checkpoint(TRUNCATE)');
            this.db.close();
        }
        this.db = null;
    }
}
exports.default = DatastoresDb;
//# sourceMappingURL=index.js.map