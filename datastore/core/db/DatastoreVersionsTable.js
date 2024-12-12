"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqliteTable_1 = require("@ulixee/commons/lib/SqliteTable");
class DatastoreVersionsTable extends SqliteTable_1.default {
    constructor(db) {
        super(db, 'DatastoreVersions', [
            ['id', 'TEXT', 'NOT NULL PRIMARY KEY'],
            ['version', 'TEXT', 'NOT NULL PRIMARY KEY'],
            ['dbxPath', 'TEXT', 'NOT NULL'],
            ['versionTimestamp', 'DATETIME'],
            ['scriptEntrypoint', 'TEXT'],
            ['source', 'TEXT'],
            ['adminIdentity', 'TEXT'],
            ['adminSignature', 'BLOB'],
            ['publishedToNetworkTimestamp', 'DATETIME'],
            ['isLatest', 'INTEGER'],
            ['isStarted', 'INTEGER'],
        ], true);
        this.versionsById = {};
        this.cacheByVersion = {};
        this.getQuery = db.prepare(`select * from ${this.tableName} where id = ? and version = ? limit 1`);
        this.latestByDatastoresQuery = db.prepare(`select * from ${this.tableName} where isLatest=1 order by id desc limit ? offset ?`);
        this.countDatastoresQuery = db.prepare(`select count(1) from ${this.tableName} where isLatest=1`);
        this.findByIdQuery = db.prepare(`select * from ${this.tableName} where id = ?`);
        this.updateLatestQuery = db.prepare(`update ${this.tableName} set isLatest=0 where id = ? and version != ?`);
    }
    list(results = 100, offset = 0) {
        const all = this.latestByDatastoresQuery.all(results, offset);
        for (const entry of all) {
            entry.versions = this.getDatastoreVersions(entry.id);
        }
        const total = this.countDatastoresQuery.pluck().get();
        return { datastores: all, total };
    }
    allCached() {
        return Object.values(this.cacheByVersion);
    }
    setDbxStopped(dbxPath) {
        for (const cached of this.allCached()) {
            if (cached.dbxPath === dbxPath) {
                this.db
                    .prepare(`update ${this.tableName} set isStarted=0 where id=? and version=?`)
                    .run(cached.id, cached.version);
                cached.isStarted = false;
                return cached;
            }
        }
    }
    setDbxStarted(id, version) {
        this.db
            .prepare(`update ${this.tableName} set isStarted=1 where id=? and version=?`)
            .run(id, version);
        if (this.cacheByVersion[`${id}_${version}`])
            this.cacheByVersion[`${id}_${version}`].isStarted = true;
        return this.get(id, version);
    }
    delete(id, version) {
        const record = this.get(id, version);
        this.db
            .prepare(`delete from ${this.tableName} where id=$id and version=$version`)
            .run({ id, version });
        delete this.cacheByVersion[`${id}_${version}`];
        return record;
    }
    recordPublishedToNetworkDate(id, version, publishedToNetworkTimestamp) {
        this.db
            .prepare(`update ${this.tableName} set publishedToNetworkTimestamp=$publishedToNetworkTimestamp where id=$id and version=$version`)
            .run({ id, version, publishedToNetworkTimestamp });
        const cached = this.cacheByVersion[`${id}_${version}`];
        if (cached) {
            cached.publishedToNetworkTimestamp = publishedToNetworkTimestamp;
        }
    }
    save(id, version, scriptEntrypoint, versionTimestamp, dbxPath, source, adminIdentity, adminSignature, publishedToNetworkTimestamp) {
        const isStarted = true;
        const latestStored = this.getLatestVersion(id);
        let isLatest = true;
        if (latestStored &&
            latestStored.localeCompare(version, undefined, { numeric: true, sensitivity: 'base' }) < 0) {
            isLatest = false;
        }
        this.insertNow([
            id,
            version,
            dbxPath,
            versionTimestamp,
            scriptEntrypoint,
            source,
            adminIdentity,
            adminSignature,
            publishedToNetworkTimestamp,
            isStarted ? 1 : 0,
            isLatest ? 1 : 0,
        ]);
        this.cacheByVersion[`${id}_${version}`] = {
            version,
            id,
            dbxPath,
            versionTimestamp,
            scriptEntrypoint,
            isStarted,
            isLatest,
            source,
            adminIdentity,
            adminSignature,
            publishedToNetworkTimestamp,
        };
        if (isLatest)
            this.updateLatestQuery.run(id, version);
        this.updateDatastoreVersionCache(id, version, versionTimestamp);
    }
    get(id, version) {
        if (!this.cacheByVersion[`${id}_${version}`]) {
            const entry = this.getQuery.get(id, version);
            if (entry) {
                entry.isStarted = !!entry.isStarted;
                this.cacheByVersion[`${id}_${version}`] = entry;
            }
        }
        return this.cacheByVersion[`${id}_${version}`];
    }
    getLatestVersion(id) {
        const versions = this.getDatastoreVersions(id);
        return versions[0]?.version;
    }
    getDatastoreVersions(id) {
        if (!this.versionsById[id]) {
            this.versionsById[id] = [];
            const records = this.versionsById[id];
            const versionRecords = this.findByIdQuery.all(id);
            const seenVersions = new Set();
            for (const record of versionRecords) {
                if (seenVersions.has(record.version))
                    continue;
                seenVersions.add(record.version);
                records.push({
                    version: record.version,
                    timestamp: record.versionTimestamp,
                });
            }
            this.sortVersionCache(id);
        }
        return this.versionsById[id];
    }
    updateDatastoreVersionCache(id, version, timestamp) {
        this.versionsById[id] ??= this.getDatastoreVersions(id);
        if (!this.versionsById[id].some(x => x.version === version)) {
            this.versionsById[id].unshift({ version, timestamp });
            this.sortVersionCache(id);
        }
    }
    sortVersionCache(id) {
        this.versionsById[id].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true, sensitivity: 'base' }));
    }
}
exports.default = DatastoreVersionsTable;
//# sourceMappingURL=DatastoreVersionsTable.js.map