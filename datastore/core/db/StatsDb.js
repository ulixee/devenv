"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require("better-sqlite3");
const Fs = require("fs");
const DatastoreStatsTable_1 = require("./DatastoreStatsTable");
const DatastoreEntityStatsTable_1 = require("./DatastoreEntityStatsTable");
const env_1 = require("../env");
class StatsDb {
    constructor(baseDir) {
        if (!Fs.existsSync(baseDir))
            Fs.mkdirSync(baseDir, { recursive: true });
        this.db = new Database(`${baseDir}/stats.db`);
        if (env_1.default.enableSqliteWalMode) {
            this.db.unsafeMode(false);
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = NORMAL');
        }
        this.datastores = new DatastoreStatsTable_1.default(this.db);
        this.datastoreEntities = new DatastoreEntityStatsTable_1.default(this.db);
    }
    close() {
        if (this.db) {
            this.db.pragma('wal_checkpoint(TRUNCATE)');
            this.db.close();
        }
        this.db = null;
    }
}
exports.default = StatsDb;
//# sourceMappingURL=StatsDb.js.map