"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqliteTable_1 = require("@ulixee/commons/lib/SqliteTable");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class QueryLogTable extends SqliteTable_1.default {
    constructor(db) {
        super(db, 'QueryLog', [
            ['queryId', 'TEXT', 'NOT NULL PRIMARY KEY'],
            ['datastoreId', 'TEXT', 'NOT NULL'],
            ['version', 'TEXT', 'NOT NULL'],
            ['query', 'TEXT', 'NOT NULL'],
            ['date', 'DATETIME', 'NOT NULL'],
            ['input', 'TEXT'],
            ['outputs', 'TEXT'],
            ['affiliateId', 'TEXT'],
            ['error', 'TEXT'],
            ['channelHoldId', 'TEXT'],
            ['creditId', 'TEXT'],
            ['bytes', 'INTEGER'],
            ['milliseconds', 'INTEGER'],
            ['microgons', 'INTEGER'],
            ['heroSessionIds', 'TEXT'],
            ['cloudNodeHost', 'TEXT'],
            ['cloudNodeIdentity', 'TEXT'],
        ], true);
    }
    record(queryId, datastoreId, version, query, startTime, affiliateId, input, outputs, error, channelHoldId, creditId, microgons, bytes, milliseconds, heroSessionIds, cloudNodeHost, cloudNodeIdentity) {
        microgons ??= 0n;
        this.insertNow([
            queryId,
            datastoreId,
            version,
            query,
            startTime,
            input ? TypeSerializer_1.default.stringify(input) : undefined,
            outputs ? TypeSerializer_1.default.stringify(outputs) : undefined,
            affiliateId,
            error ? TypeSerializer_1.default.stringify(error) : undefined,
            channelHoldId,
            creditId,
            bytes,
            milliseconds,
            microgons,
            heroSessionIds ? TypeSerializer_1.default.stringify(heroSessionIds) : undefined,
            cloudNodeHost,
            cloudNodeIdentity,
        ]);
    }
}
exports.default = QueryLogTable;
//# sourceMappingURL=QueryLogTable.js.map