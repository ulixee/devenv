"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Fs = require("fs");
const Path = require("path");
const promises_1 = require("stream/promises");
const zlib_1 = require("zlib");
class ReplayRegistryDiskStore {
    constructor(storageDir) {
        this.storageDir = storageDir;
    }
    async get(sessionId) {
        const path = Path.join(this.storageDir, `${sessionId}.db.gz`);
        if (await (0, fileUtils_1.existsAsync)(path)) {
            return await (0, promises_1.pipeline)(Fs.createReadStream(path), (0, zlib_1.createGunzip)(), async (result) => {
                const buffers = [];
                for await (const chunk of result) {
                    buffers.push(chunk);
                }
                return { db: Buffer.concat(buffers) };
            }, { end: true });
        }
    }
    async delete(sessionId) {
        const path = Path.join(this.storageDir, `${sessionId}.db.gz`);
        const didFail = await Fs.promises.unlink(path).catch(() => true);
        return { success: !didFail };
    }
    async store(sessionId, db) {
        const path = Path.join(this.storageDir, `${sessionId}.db.gz`);
        await Fs.promises.writeFile(path, db);
        return { success: true };
    }
    async ids() {
        const sessionIds = [];
        if (!(await (0, fileUtils_1.existsAsync)(this.storageDir)))
            return { sessionIds };
        for (const dbName of await Fs.promises.readdir(this.storageDir)) {
            if (!dbName.endsWith('.db.gz'))
                continue;
            const sessionId = dbName.slice(0, -6);
            sessionIds.push(sessionId);
        }
        return { sessionIds };
    }
    static async getCompressedDb(path) {
        return await (0, promises_1.pipeline)(Fs.createReadStream(path), (0, zlib_1.createGzip)(), async (result) => {
            const buffers = [];
            for await (const chunk of result) {
                buffers.push(chunk);
            }
            return Buffer.concat(buffers);
        }, { end: true });
    }
}
exports.default = ReplayRegistryDiskStore;
//# sourceMappingURL=ReplayRegistryDiskStore.js.map