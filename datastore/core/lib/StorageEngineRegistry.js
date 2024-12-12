"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StorageEngineRegistry_nodeAddress, _StorageEngineRegistry_localStorageByIdAndVersion, _StorageEngineRegistry_remoteConnectionsByHost;
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const datastore_1 = require("@ulixee/datastore");
const RemoteStorageEngine_1 = require("@ulixee/datastore/storage-engines/RemoteStorageEngine");
const SqliteStorageEngine_1 = require("@ulixee/datastore/storage-engines/SqliteStorageEngine");
const Fs = require("fs");
const Path = require("path");
const env_1 = require("../env");
class StorageEngineRegistry {
    constructor(dataDir, nodeAddress) {
        _StorageEngineRegistry_nodeAddress.set(this, void 0);
        _StorageEngineRegistry_localStorageByIdAndVersion.set(this, new Map());
        _StorageEngineRegistry_remoteConnectionsByHost.set(this, new Map());
        this.dataDir = Path.join(dataDir, 'storage');
        __classPrivateFieldSet(this, _StorageEngineRegistry_nodeAddress, nodeAddress, "f");
        if (!Fs.existsSync(this.dataDir))
            Fs.mkdirSync(this.dataDir, { recursive: true });
    }
    async close() {
        await Promise.allSettled([...__classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").values()].map(x => x.close()));
        await Promise.allSettled([...__classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").values()].map(x => x.disconnect()));
        __classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").clear();
    }
    isHostingStorageEngine(storageEngineHost) {
        if (storageEngineHost) {
            const engineUrl = (0, utils_1.toUrl)(storageEngineHost);
            return engineUrl.host === __classPrivateFieldGet(this, _StorageEngineRegistry_nodeAddress, "f").host;
        }
        return true;
    }
    get(manifest, queryMetadata) {
        const { storageEngineHost, id, version } = manifest;
        const key = `${id}@${version}`;
        if (__classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").has(key)) {
            return __classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").get(key);
        }
        let engine;
        // if no endpoint, or it's this machine, use file storage
        if (this.isHostingStorageEngine(storageEngineHost)) {
            engine = new SqliteStorageEngine_1.default(Path.join(this.dataDir, `${key}.db`));
            __classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").set(key, engine);
        }
        else {
            const connection = this.getRemoteConnection(storageEngineHost);
            engine = new RemoteStorageEngine_1.default(connection, queryMetadata);
        }
        return engine;
    }
    async deleteExisting(datastoreId, version) {
        const key = `${datastoreId}@${version}`;
        const entry = __classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").get(key);
        if (!entry) {
            const localDbPath = Path.join(this.dataDir, `${key}.db`);
            if (await (0, fileUtils_1.existsAsync)(localDbPath))
                await Fs.promises.rm(localDbPath).catch(() => null);
            return;
        }
        await entry.close();
        __classPrivateFieldGet(this, _StorageEngineRegistry_localStorageByIdAndVersion, "f").delete(key);
        if (entry instanceof SqliteStorageEngine_1.default) {
            await Fs.promises.rm(entry.path).catch(() => null);
        }
    }
    async createRemote(manifest, version, previousVersion) {
        const client = this.get(manifest, {
            id: manifest.id,
            version: manifest.version,
            queryId: 'StorageEngine.createRemote',
        });
        if (this.isHostingStorageEngine(manifest.storageEngineHost)) {
            throw new Error('This datastore needs to be uploaded to the local storage engine host, not a remote one.');
        }
        await client.createRemote(version, previousVersion);
    }
    async create(vm, datastoreVersion, previousVersion, options) {
        if (!this.isHostingStorageEngine(datastoreVersion.storageEngineHost)) {
            throw new Error(`Cannot migrate on this Host. Not the Storage Endpoint (${datastoreVersion.storageEngineHost})`);
        }
        const storagePath = Path.join(this.dataDir, `${datastoreVersion.version}.db`);
        if (options?.clearExisting && env_1.default.serverEnvironment !== 'production') {
            await this.deleteExisting(datastoreVersion.id, datastoreVersion.version);
        }
        if (await (0, fileUtils_1.existsAsync)(storagePath)) {
            return;
        }
        const storage = this.get(datastoreVersion, {
            id: datastoreVersion.id,
            version: datastoreVersion.version,
            queryId: 'StorageEngine.create',
        });
        const datastore = await vm.getDatastore(datastoreVersion.runtimePath);
        let previous;
        if (previousVersion) {
            previous = await vm.open(previousVersion.runtimePath, this.get(previousVersion, {
                id: previousVersion.id,
                version: previousVersion.version,
                queryId: 'StorageEngine.create',
            }), previousVersion);
        }
        storage.bind(datastore);
        await datastore.bind({ storageEngine: storage });
        await storage.create(datastore, previous);
        if (options?.isWatching) {
            const { id, version, runtimePath } = datastoreVersion;
            let watcher;
            const callback = async () => {
                if (!Fs.existsSync(runtimePath)) {
                    if (watcher)
                        watcher.close();
                    else
                        Fs.unwatchFile(runtimePath);
                }
                else {
                    await this.deleteExisting(id, version);
                    await this.create(vm, datastoreVersion, previousVersion);
                }
            };
            if (process.platform === 'win32' || process.platform === 'darwin') {
                watcher = Fs.watch(runtimePath, { persistent: false }, () => callback());
            }
            else {
                Fs.watchFile(runtimePath, { persistent: false }, () => callback());
            }
        }
    }
    onEngineDisconnected(storageHost, connection) {
        if (__classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").get(storageHost) === connection) {
            __classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").delete(storageHost);
        }
    }
    getRemoteConnection(storageHost) {
        const cleanStorageHost = (0, utils_1.toUrl)(storageHost).host;
        if (!__classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").has(cleanStorageHost)) {
            const connection = datastore_1.ConnectionToDatastoreCore.remote(cleanStorageHost);
            connection.once('disconnected', () => this.onEngineDisconnected(storageHost, connection));
            __classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").set(cleanStorageHost, connection);
        }
        return __classPrivateFieldGet(this, _StorageEngineRegistry_remoteConnectionsByHost, "f").get(cleanStorageHost);
    }
}
_StorageEngineRegistry_nodeAddress = new WeakMap(), _StorageEngineRegistry_localStorageByIdAndVersion = new WeakMap(), _StorageEngineRegistry_remoteConnectionsByHost = new WeakMap();
exports.default = StorageEngineRegistry;
//# sourceMappingURL=StorageEngineRegistry.js.map