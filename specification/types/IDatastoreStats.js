"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreStatsSchema = void 0;
const zod_1 = require("zod");
const positiveInt = zod_1.z.number().int().positive();
const positiveBigInt = zod_1.z.bigint().positive();
exports.DatastoreStatsSchema = zod_1.z.object({
    queries: positiveInt.describe('Total number of queries'),
    errors: positiveInt.describe('Total number of errors'),
    totalSpend: positiveBigInt.describe('Total microgons spent.'),
    totalCreditSpend: positiveBigInt.describe('Total credits spent in microgons (this number is included in totalSpend).'),
    averageBytesPerQuery: positiveInt.describe('Average bytes of output returned per query.'),
    maxBytesPerQuery: positiveInt.describe('The largest byte count seen.'),
    averageMilliseconds: positiveInt.describe('Average milliseconds spent before response.'),
    maxMilliseconds: positiveInt.describe('Max milliseconds spent before response.'),
    averageTotalPricePerQuery: positiveBigInt.describe('Average total microgons paid for a query.'),
    maxPricePerQuery: positiveBigInt.describe('The largest total microgon price seen.'),
});
//# sourceMappingURL=IDatastoreStats.js.map