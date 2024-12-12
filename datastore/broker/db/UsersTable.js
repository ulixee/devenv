"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsersTable {
    constructor(db) {
        this.db = db;
        db.exec(`CREATE TABLE IF NOT EXISTS Users (
      identity TEXT NOT NULL PRIMARY KEY,
      name TEXT,
      organizationId TEXT NOT NULL,
      modified DATETIME NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES Organizations(id)
    )`);
        db.exec(`CREATE INDEX IF NOT EXISTS Users_organizationId ON Users(organizationId)`);
        this.insertQuery = db.prepare(`INSERT INTO Users (name, organizationId, identity, modified) VALUES (:name, :organizationId, :identity, :modified)`);
        this.getOrganizationQuery = db.prepare(`SELECT organizationId FROM Users WHERE identity = :identity`);
    }
    create(identity, name, organizationId) {
        this.insertQuery.run({ identity, name, organizationId, modified: Date.now() });
    }
    editName(identity, name) {
        this.db
            .prepare(`UPDATE Users SET name = :name, modified = :modified WHERE identity = :identity`)
            .run({ identity, name, modified: Date.now() });
    }
    getOrganizationId(identity) {
        return this.getOrganizationQuery.safeIntegers(false).pluck().get({ identity });
    }
    /// ADMIN APIs
    count() {
        const count = this.db.prepare(`SELECT COUNT(*) FROM Users`).pluck().get() ?? 0n;
        return Number(count);
    }
    list() {
        return this.db
            .prepare(`SELECT * FROM Users`)
            .safeIntegers(false)
            .all()
            .map(parseRecord);
    }
    delete(identity) {
        this.db.prepare(`DELETE FROM Users WHERE identity = ?`).run(identity);
    }
    listByOrganization(organizationId) {
        return this.db
            .prepare(`SELECT * FROM Users WHERE organizationId = ?`)
            .safeIntegers(false)
            .all(organizationId);
    }
}
exports.default = UsersTable;
function parseRecord(record) {
    return {
        ...record,
        modified: Number(record.modified),
    };
}
//# sourceMappingURL=UsersTable.js.map