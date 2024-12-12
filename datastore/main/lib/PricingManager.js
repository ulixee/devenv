"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const sql_engine_1 = require("@ulixee/sql-engine");
class PricingManager {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    async getEntityPrice(datastoreId, version, name) {
        const manifest = await this.apiClient.getMeta(datastoreId, version);
        const details = manifest.crawlersByName[name] ??
            manifest.extractorsByName[name] ??
            manifest.tablesByName[name];
        return details?.netBasePrice;
    }
    async getQueryPrice(datastoreId, version, sql) {
        const manifest = await this.apiClient.getMeta(datastoreId, version);
        const sqlParser = new sql_engine_1.SqlParser(sql);
        const entities = sqlParser.extractCalls();
        let price = 0n;
        for (const call of entities) {
            const details = manifest.crawlersByName[call] ??
                manifest.extractorsByName[call] ??
                manifest.tablesByName[call];
            price += details?.netBasePrice ?? 0n;
        }
        return price;
    }
    static computePrice(manifest, entityCalls) {
        let price = 0n;
        for (const call of entityCalls) {
            const entity = manifest.extractorsByName[call] ??
                manifest.crawlersByName[call] ??
                manifest.tablesByName[call];
            if (entity?.prices) {
                price += PricingManager.getNetBasePrice(entity.prices);
            }
        }
        return price;
    }
    static getNetBasePrice(prices) {
        let basePrice = 0n;
        for (const price of prices) {
            if (!!price.basePrice)
                basePrice += BigInt(price.basePrice);
        }
        return basePrice;
    }
    static getOfficialBytes(output) {
        if (output === undefined || output === null)
            return 0;
        // must use types or you can't serialize Bigint/Regex/etc
        return Buffer.byteLength(Buffer.from(TypeSerializer_1.default.stringify(output), 'utf8'));
    }
}
exports.default = PricingManager;
//# sourceMappingURL=PricingManager.js.map