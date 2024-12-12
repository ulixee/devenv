"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require("better-sqlite3");
const Fs = require("node:fs");
class DatabrokerDb {
    constructor(baseDir) {
        if (!Fs.existsSync(baseDir))
            Fs.mkdirSync(baseDir, { recursive: true });
        this.db = new Database(`${baseDir}/datastore-whitelist.v0.db`);
        this.db.unsafeMode(false);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('synchronous = NORMAL');
        this.db.exec(`CREATE TABLE IF NOT EXISTS DomainWhitelist (
domain TEXT NOT NULL PRIMARY KEY
);
`);
        this.db.exec('CREATE UNIQUE INDEX IF NOT EXISTS DomainWhitelist_domain ON DomainWhitelist (domain);');
        this.whitelistQuery = this.db.prepare(`SELECT 1 FROM DomainWhitelist WHERE domain = :domain`);
    }
    close() {
        if (this.db) {
            this.db.pragma('wal_checkpoint(TRUNCATE)');
            this.db.close();
        }
        this.db = null;
    }
    add(domain) {
        this.db.prepare(`INSERT OR IGNORE INTO DomainWhitelist (domain) VALUES (:domain);`).run({ domain });
    }
    delete(domain) {
        this.db.prepare(`DELETE FROM DomainWhitelist WHERE domain = :domain;`).run({ domain });
    }
    list() {
        return this.db.prepare(`SELECT domain FROM DomainWhitelist;`).pluck().all();
    }
    isWhitelisted(_datastoreId, domain) {
        return !!this.whitelistQuery.get({ domain });
    }
}
exports.default = DatabrokerDb;
//# sourceMappingURL=DatastoreWhitelistDb.js.map