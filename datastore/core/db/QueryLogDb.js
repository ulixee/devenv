"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require("better-sqlite3");
const Fs = require("fs");
const QueryLogTable_1 = require("./QueryLogTable");
const env_1 = require("../env");
class QueryLogDb {
    constructor(baseDir) {
        if (!Fs.existsSync(baseDir))
            Fs.mkdirSync(baseDir, { recursive: true });
        this.db = new Database(`${baseDir}/querylog.db`);
        if (env_1.default.enableSqliteWalMode) {
            this.db.unsafeMode(false);
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = NORMAL');
        }
        this.logTable = new QueryLogTable_1.default(this.db);
    }
    close() {
        if (this.db?.open) {
            this.db.pragma('wal_checkpoint(TRUNCATE)');
            this.db.close();
        }
        this.db = null;
    }
}
exports.default = QueryLogDb;
//# sourceMappingURL=QueryLogDb.js.map