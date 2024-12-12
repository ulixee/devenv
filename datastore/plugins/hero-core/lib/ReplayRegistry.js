"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const DefaultSessionRegistry_1 = require("@ulixee/hero-core/dbs/DefaultSessionRegistry");
const ReplayRegistryDiskStore_1 = require("./ReplayRegistryDiskStore");
const ReplayRegistryServiceClient_1 = require("./ReplayRegistryServiceClient");
class ReplayRegistry extends TypedEventEmitter_1.default {
    get defaultDir() {
        return this.defaultSessionRegistry.defaultDir;
    }
    constructor(config) {
        super();
        this.config = config;
        this.storePromises = new Map();
        this.serviceClient = config.serviceClient
            ? new ReplayRegistryServiceClient_1.default(config.serviceClient)
            : null;
        if (!this.serviceClient) {
            this.replayStorageRegistry = new ReplayRegistryDiskStore_1.default(config.queryHeroStorageDir);
        }
        this.defaultSessionRegistry = new DefaultSessionRegistry_1.default(config.defaultHeroStorageDir);
    }
    async shutdown() {
        await this.flush();
        this.config = null;
    }
    async flush() {
        const storage = [...this.storePromises.values()];
        this.storePromises.clear();
        await Promise.allSettled(storage);
    }
    create(sessionId, customPath) {
        return this.defaultSessionRegistry.create(sessionId, customPath);
    }
    async retain(sessionId, customPath) {
        const record = await this.defaultSessionRegistry
            .retain(sessionId, customPath)
            .catch(() => null);
        if (record)
            return record;
        for (const store of [this.replayStorageRegistry, this.serviceClient]) {
            if (!store)
                continue;
            const entry = await store.get(sessionId);
            if (entry?.db) {
                await this.defaultSessionRegistry.store(sessionId, entry.db);
                return this.defaultSessionRegistry.retain(sessionId);
            }
        }
    }
    async get(sessionId, customPath) {
        const record = await this.defaultSessionRegistry.get(sessionId, customPath).catch(() => null);
        if (record)
            return record;
        for (const store of [this.replayStorageRegistry, this.serviceClient]) {
            if (!store)
                continue;
            const entry = await store.get(sessionId);
            if (entry?.db)
                return await this.defaultSessionRegistry.store(sessionId, entry.db);
        }
    }
    async ids() {
        const idSet = new Set(await this.defaultSessionRegistry.ids());
        for (const store of [this.replayStorageRegistry, this.serviceClient]) {
            if (!store)
                continue;
            const entries = await store.ids();
            for (const id of entries.sessionIds) {
                idSet.add(id);
            }
        }
        return [...idSet];
    }
    async close(sessionId, isDeleteRequested) {
        if (this.storePromises.has(sessionId)) {
            await Promise.allSettled(this.storePromises.get(sessionId));
            this.storePromises.delete(sessionId);
        }
        await this.defaultSessionRegistry.close(sessionId, isDeleteRequested);
    }
    async delete(sessionId) {
        if (this.storePromises.has(sessionId)) {
            await Promise.allSettled(this.storePromises.get(sessionId));
            this.storePromises.delete(sessionId);
        }
        await this.defaultSessionRegistry.close(sessionId, true);
        if (this.serviceClient) {
            await this.serviceClient.delete(sessionId);
        }
        else {
            await this.replayStorageRegistry.delete(sessionId);
        }
    }
    async store(sessionId) {
        if (!this.storePromises.has(sessionId)) {
            this.storePromises.set(sessionId, []);
        }
        this.storePromises
            .get(sessionId)
            .push(this.storeInternal(sessionId).catch(e => console.warn(`Error storing cached session`, e)));
    }
    async storeInternal(sessionId) {
        const entry = await this.defaultSessionRegistry.get(sessionId);
        if (!entry?.session)
            throw new Error(`Session not able to be retained: ${sessionId}`);
        const path = entry.path;
        const timestamp = Date.now();
        const db = await ReplayRegistryDiskStore_1.default.getCompressedDb(path);
        if (this.serviceClient) {
            await this.serviceClient.store({
                sessionId,
                timestamp,
                db,
            });
        }
        else {
            await this.replayStorageRegistry.store(sessionId, db);
        }
    }
}
exports.default = ReplayRegistry;
//# sourceMappingURL=ReplayRegistry.js.map