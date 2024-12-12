"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _StatsTrackerDiskStore_statsDb, _StatsTrackerDiskStore_queryLogDb;
Object.defineProperty(exports, "__esModule", { value: true });
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const QueryLogDb_1 = require("../db/QueryLogDb");
const StatsDb_1 = require("../db/StatsDb");
const translateDatastoreMetadata_1 = require("./translateDatastoreMetadata");
class StatsTrackerDiskStore extends TypedEventEmitter_1.default {
    get statsDb() {
        __classPrivateFieldSet(this, _StatsTrackerDiskStore_statsDb, __classPrivateFieldGet(this, _StatsTrackerDiskStore_statsDb, "f") ?? new StatsDb_1.default(this.datastoresDir), "f");
        return __classPrivateFieldGet(this, _StatsTrackerDiskStore_statsDb, "f");
    }
    get queryLogDb() {
        __classPrivateFieldSet(this, _StatsTrackerDiskStore_queryLogDb, __classPrivateFieldGet(this, _StatsTrackerDiskStore_queryLogDb, "f") ?? new QueryLogDb_1.default(this.datastoresDir), "f");
        return __classPrivateFieldGet(this, _StatsTrackerDiskStore_queryLogDb, "f");
    }
    constructor(datastoresDir) {
        super();
        this.datastoresDir = datastoresDir;
        _StatsTrackerDiskStore_statsDb.set(this, void 0);
        _StatsTrackerDiskStore_queryLogDb.set(this, void 0);
    }
    async close() {
        __classPrivateFieldGet(this, _StatsTrackerDiskStore_statsDb, "f")?.close();
        __classPrivateFieldGet(this, _StatsTrackerDiskStore_queryLogDb, "f")?.close();
        __classPrivateFieldSet(this, _StatsTrackerDiskStore_statsDb, null, "f");
        __classPrivateFieldSet(this, _StatsTrackerDiskStore_queryLogDb, null, "f");
        return Promise.resolve();
    }
    getForDatastoreVersion(manifest) {
        const { version, id } = manifest;
        const statsByEntityName = {};
        for (const [type, name] of [
            ...Object.keys(manifest.extractorsByName).map(x => ['Extractor', x]),
            ...Object.keys(manifest.tablesByName).map(x => ['Table', x]),
            ...Object.keys(manifest.crawlersByName).map(x => ['Crawler', x]),
        ]) {
            statsByEntityName[name] = {
                name,
                type: type,
                stats: (0, translateDatastoreMetadata_1.translateStats)(this.statsDb.datastoreEntities.getByVersion(id, version, name)),
            };
        }
        return {
            stats: (0, translateDatastoreMetadata_1.translateStats)(this.statsDb.datastores.getByVersion(id, version)),
            statsByEntityName,
        };
    }
    getForDatastore(manifest) {
        const { id } = manifest;
        const statsByEntityName = {};
        for (const [type, name] of [
            ...Object.keys(manifest.extractorsByName).map(x => ['Extractor', x]),
            ...Object.keys(manifest.tablesByName).map(x => ['Table', x]),
            ...Object.keys(manifest.crawlersByName).map(x => ['Crawler', x]),
        ]) {
            statsByEntityName[name] = {
                name,
                type: type,
                stats: (0, translateDatastoreMetadata_1.translateStats)(this.statsDb.datastoreEntities.getByDatastore(id, name)),
            };
        }
        return {
            stats: (0, translateDatastoreMetadata_1.translateStats)(this.statsDb.datastores.get(id)),
            statsByEntityName,
        };
    }
    getDatastoreSummary(id) {
        return {
            stats: (0, translateDatastoreMetadata_1.translateStats)(this.statsDb.datastores.get(id)),
        };
    }
    recordEntityStats(details) {
        this.statsDb.datastoreEntities.record(details.datastoreId, details.version, details.entityName, details.microgons, details.bytes, details.milliseconds, details.didUseCredits ? details.microgons : 0n, !!details.error);
    }
    recordQuery(details) {
        const { datastoreStats } = this.statsDb.datastores.record(details.datastoreId, details.version, details.microgons, details.bytes, details.milliseconds, details.creditId ? details.microgons : 0n, !!details.error);
        this.emit('stats', datastoreStats);
        this.queryLogDb.logTable.record(details.queryId, details.datastoreId, details.version, details.query, details.startTime, details.affiliateId, details.input, details.outputs, details.error, details.channelHoldId, details.creditId, details.microgons, details.bytes, details.milliseconds, details.heroSessionIds, details.cloudNodeHost, details.cloudNodeIdentity);
    }
}
_StatsTrackerDiskStore_statsDb = new WeakMap(), _StatsTrackerDiskStore_queryLogDb = new WeakMap();
exports.default = StatsTrackerDiskStore;
//# sourceMappingURL=StatsTrackerDiskStore.js.map