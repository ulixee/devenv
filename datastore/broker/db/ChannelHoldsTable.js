"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelHoldsTable {
    constructor(db) {
        this.db = db;
        db.exec(`CREATE TABLE IF NOT EXISTS ChannelHolds (
      channelHoldId TEXT NOT NULL PRIMARY KEY,
      organizationId INTEGER NOT NULL,
      createdByIdentity TEXT NOT NULL,
      domain TEXT,
      heldMicrogons INTEGER NOT NULL,
      settledMicrogons INTEGER,
      settlementDate DATETIME,
      created DATETIME NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES Organizations(id)
    );`);
        db.exec(`CREATE INDEX IF NOT EXISTS ChannelHolds_organizationId ON ChannelHolds (organizationId);`);
        this.insertQuery = db.prepare(`INSERT INTO ChannelHolds (channelHoldId, organizationId, createdByIdentity, domain, heldMicrogons, created) 
            VALUES (:channelHoldId, :organizationId, :createdByIdentity, :domain, :heldMicrogons, :created)`);
        this.updateSettlementQuery = db.prepare(`UPDATE ChannelHolds SET settledMicrogons = :settledMicrogons, settlementDate = :date WHERE channelHoldId = :channelHoldId 
            RETURNING organizationId, heldMicrogons`);
    }
    create(channelHold) {
        channelHold.created = Date.now();
        this.insertQuery.run(channelHold);
    }
    updateSettlementReturningChange(channelHoldId, settledMicrogons, settlementDate) {
        const { organizationId, heldMicrogons } = this.updateSettlementQuery.get({
            channelHoldId,
            settledMicrogons,
            date: settlementDate,
        });
        const change = heldMicrogons - settledMicrogons;
        return [organizationId, heldMicrogons, change];
    }
    /// ADMIN APIS
    count() {
        return (this.db
            .prepare(`SELECT COUNT(*) FROM ChannelHolds`)
            .safeIntegers(false)
            .pluck()
            .get() ?? 0);
    }
    countOpen() {
        return (this.db
            .prepare(`SELECT COUNT(*) FROM ChannelHolds WHERE settlementDate IS NULL`)
            .safeIntegers(false)
            .pluck()
            .get() ?? 0);
    }
    pendingBalance() {
        return (this.db
            .prepare(`SELECT SUM(heldMicrogons) FROM ChannelHolds WHERE settlementDate IS NULL`)
            .pluck()
            .get() ?? 0n);
    }
}
exports.default = ChannelHoldsTable;
//# sourceMappingURL=ChannelHoldsTable.js.map