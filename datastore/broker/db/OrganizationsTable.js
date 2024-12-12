"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
class OrganizationsTable {
    constructor(db) {
        this.db = db;
        db.exec(`CREATE TABLE IF NOT EXISTS Organizations (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT,
      totalGranted INTEGER NOT NULL,
      balance INTEGER NOT NULL,
      balanceInChannelHolds INTEGER NOT NULL,
      modified DATETIME NOT NULL,
      CHECK (balance >= 0)
    ) 
`);
        this.insertQuery = db.prepare(`INSERT INTO Organizations (id, name, balance, totalGranted, balanceInChannelHolds, modified) VALUES (:id, :name, :balance, :balance, 0, :modified)`);
        this.updateNameQuery = db.prepare(`UPDATE Organizations SET name = :name, modified = :modified WHERE id = :id`);
        this.debitQuery = db.prepare(`UPDATE Organizations SET balance = balance - :amount, balanceInChannelHolds = balanceInChannelHolds + :amount, modified = :modified WHERE id = :id`);
        this.settleQuery = db.prepare(`UPDATE Organizations SET balance = balance + :change, balanceInChannelHolds = balanceInChannelHolds - :debitedAmount, modified = :modified WHERE id = :id`);
        this.grantQuery = db.prepare(`UPDATE Organizations SET balance = balance + :amount, totalGranted = totalGranted + :amount, modified = :modified WHERE id = :id`);
        this.getQuery = db.prepare(`SELECT * FROM Organizations WHERE id = :id`);
    }
    create(name, balance) {
        const id = (0, nanoid_1.nanoid)();
        this.insertQuery.run({
            id,
            name,
            totalGranted: balance,
            balanceInChannelHolds: 0n,
            balance,
            modified: Date.now(),
        });
        return id;
    }
    delete(organizationId) {
        this.db
            .transaction(id => {
            this.db.prepare(`DELETE FROM Users WHERE organizationId = ?`).run(id);
            this.db.prepare(`DELETE FROM Organizations WHERE id = ?`).run(id);
        })
            .default(organizationId);
    }
    updateName(organizationId, name) {
        this.updateNameQuery.run({ id: organizationId, name, modified: Date.now() });
    }
    debit(organizationId, amount) {
        this.debitQuery.run({ id: organizationId, amount, modified: Date.now() });
    }
    grant(organizationId, amount) {
        this.grantQuery.run({ id: organizationId, amount, modified: Date.now() });
    }
    settle(organizationId, change, debitedAmount) {
        this.settleQuery.run({ id: organizationId, change, debitedAmount, modified: Date.now() });
    }
    get(organizationId) {
        const org = this.getQuery.get({ id: organizationId });
        if (!org)
            throw new Error(`Organization not found: ${organizationId}`);
        return parseRecord(org);
    }
    /// ADMIN APIS (don't need as much prep, so just do them on the fly)
    count() {
        return (this.db
            .prepare(`SELECT COUNT(*) FROM Organizations`)
            .pluck()
            .safeIntegers(false)
            .get() ?? 0);
    }
    list() {
        return this.db
            .prepare(`SELECT * FROM Organizations`)
            .all()
            .map(parseRecord);
    }
    totalGranted() {
        return (this.db
            .prepare(`SELECT SUM(totalGranted) FROM Organizations`)
            .safeIntegers(true)
            .pluck()
            .get() ?? 0n);
    }
    totalBalance() {
        return (this.db
            .prepare(`SELECT SUM(balance) FROM Organizations`)
            .safeIntegers(true)
            .pluck()
            .get() ?? 0n);
    }
}
exports.default = OrganizationsTable;
function parseRecord(record) {
    return {
        ...record,
        modified: Number(record.modified),
    };
}
//# sourceMappingURL=OrganizationsTable.js.map