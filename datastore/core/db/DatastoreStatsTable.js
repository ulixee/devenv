"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqliteTable_1 = require("@ulixee/commons/lib/SqliteTable");
const DatastoreEntityStatsTable_1 = require("./DatastoreEntityStatsTable");
class DatastoreStatsTable extends SqliteTable_1.default {
    constructor(db) {
        super(db, 'DatastoreStats', [
            ['datastoreId', 'TEXT', 'NOT NULL PRIMARY KEY'],
            ['version', 'TEXT', 'NOT NULL PRIMARY KEY'],
            ['runs', 'INTEGER'],
            ['errors', 'INTEGER'],
            ['lastRunTimestamp', 'DATETIME'],
            ['averageBytes', 'INTEGER'],
            ['maxBytes', 'INTEGER'],
            ['minBytes', 'INTEGER'],
            ['averageMilliseconds', 'INTEGER'],
            ['maxMilliseconds', 'INTEGER'],
            ['minMilliseconds', 'INTEGER'],
            ['averagePrice', 'INTEGER'],
            ['maxPrice', 'INTEGER'],
            ['minPrice', 'INTEGER'],
            ['totalSpend', 'INTEGER'],
            ['totalCreditSpend', 'INTEGER'],
        ], true);
        this.getQuery = db.prepare(`select * from ${this.tableName} where datastoreId = ? limit 1`);
        this.getByVersionQuery = db.prepare(`select * from ${this.tableName} where datastoreId = ? and version = ? limit 1`);
    }
    record(datastoreId, version, price, bytes, milliseconds, creditsUsed, isError) {
        price ??= 0n;
        const versionStats = this.getByVersion(datastoreId, version);
        this.addToStats(versionStats, isError, price, milliseconds, bytes, creditsUsed);
        const datastoreStats = this.get(datastoreId);
        this.addToStats(datastoreStats, isError, price, milliseconds, bytes, creditsUsed);
        this.insertNow([
            datastoreId,
            version,
            versionStats.runs,
            versionStats.errors,
            versionStats.lastRunTimestamp,
            versionStats.averageBytes,
            versionStats.maxBytes,
            versionStats.minBytes,
            versionStats.averageMilliseconds,
            versionStats.maxMilliseconds,
            versionStats.minMilliseconds,
            versionStats.averagePrice,
            versionStats.maxPrice,
            versionStats.minPrice,
            versionStats.totalSpend,
            versionStats.totalCreditSpend,
        ]);
        return { datastoreStats, versionStats };
    }
    getByVersion(datastoreId, version) {
        DatastoreStatsTable.byVersion[`${datastoreId}_${version}`] ??= this.process(this.getByVersionQuery.get(datastoreId, version) ?? this.emptyStats(datastoreId, version));
        return DatastoreStatsTable.byVersion[`${datastoreId}_${version}`];
    }
    get(datastoreId) {
        DatastoreStatsTable.byDatastore[datastoreId] ??= this.process(this.getQuery.get(datastoreId) ?? this.emptyStats(datastoreId));
        return DatastoreStatsTable.byDatastore[datastoreId];
    }
    process(record) {
        record.averagePrice = BigInt(record.averagePrice);
        record.maxPrice = BigInt(record.maxPrice);
        record.minPrice = BigInt(record.minPrice);
        record.totalSpend = BigInt(record.totalSpend);
        record.totalCreditSpend = BigInt(record.totalCreditSpend);
        return record;
    }
    emptyStats(datastoreId, version) {
        return {
            datastoreId,
            version,
            lastRunTimestamp: Date.now(),
            runs: 0,
            errors: 0,
            averageBytes: 0,
            maxBytes: 0,
            minBytes: Number.MAX_SAFE_INTEGER,
            averagePrice: 0n,
            maxPrice: 0n,
            minPrice: BigInt(Number.MAX_SAFE_INTEGER),
            averageMilliseconds: 0,
            maxMilliseconds: 0,
            minMilliseconds: 0,
            totalSpend: 0n,
            totalCreditSpend: 0n,
        };
    }
    addToStats(stats, isError, price, milliseconds, bytes, creditsUsed) {
        stats.runs += 1;
        if (isError)
            stats.errors += 1;
        stats.lastRunTimestamp = Date.now();
        if (price > stats.maxPrice)
            stats.maxPrice = price;
        if (price < stats.minPrice)
            stats.minPrice = price;
        stats.averagePrice = (0, DatastoreEntityStatsTable_1.calculateNewAverageBigInt)(stats.averagePrice, price, stats.runs);
        stats.maxMilliseconds = Math.max(stats.maxMilliseconds, milliseconds);
        stats.averageMilliseconds = calculateNewAverage(stats.averageMilliseconds, milliseconds, stats.runs);
        stats.maxBytes = Math.max(stats.maxBytes, bytes);
        stats.minBytes = Math.min(stats.minBytes, bytes);
        stats.averageBytes = calculateNewAverage(stats.averageBytes, bytes, stats.runs);
        stats.totalSpend += price;
        if (creditsUsed)
            stats.totalCreditSpend += creditsUsed;
    }
}
DatastoreStatsTable.byVersion = {};
DatastoreStatsTable.byDatastore = {};
exports.default = DatastoreStatsTable;
function calculateNewAverage(oldAverage, value, newTotalValues) {
    if (newTotalValues === 1)
        return value;
    return Math.round(oldAverage + (value - oldAverage) / newTotalValues);
}
//# sourceMappingURL=DatastoreStatsTable.js.map