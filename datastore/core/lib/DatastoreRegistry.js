"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("@ulixee/commons/lib/Logger");
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const utils_1 = require("@ulixee/commons/lib/utils");
const fs_1 = require("fs");
const DatastoreRegistryDiskStore_1 = require("./DatastoreRegistryDiskStore");
const DatastoreRegistryServiceClient_1 = require("./DatastoreRegistryServiceClient");
const dbxUtils_1 = require("./dbxUtils");
const errors_1 = require("./errors");
const { log } = (0, Logger_1.default)(module);
class DatastoreRegistry extends TypedEventEmitter_1.default {
    get sourceOfTruthAddress() {
        return this.clusterStore?.hostAddress;
    }
    constructor(datastoreDir, connectionToHostedServiceCore, config, installCallbackFn) {
        super();
        this.config = config;
        this.installCallbackFn = installCallbackFn;
        this.stores = [];
        (0, utils_1.bindFunctions)(this);
        this.logger = log.createChild(module);
        this.diskStore = new DatastoreRegistryDiskStore_1.default(datastoreDir, !connectionToHostedServiceCore, config?.storageEngineHost, this.onDatastoreInstalled.bind(this));
        if (connectionToHostedServiceCore) {
            this.clusterStore = new DatastoreRegistryServiceClient_1.default(connectionToHostedServiceCore);
        }
        this.stores = [this.diskStore, this.clusterStore].filter(Boolean);
    }
    async close() {
        await Promise.allSettled(this.stores.map(x => x.close()));
    }
    async list(count = 100, offset = 0) {
        const service = this.clusterStore ?? this.diskStore;
        return await service.list(count, offset);
    }
    async getVersions(id) {
        const service = this.clusterStore ?? this.diskStore;
        return await service.getVersions(id);
    }
    async get(id, version, throwIfNotExists = true) {
        let manifestWithLatest;
        const latestVersion = await this.getLatestVersion(id);
        version ??= latestVersion;
        for (const service of this.stores) {
            manifestWithLatest = (await service.get(id, version));
            if (manifestWithLatest) {
                try {
                    // must install into local disk store
                    let runtime = await this.diskStore.getRuntime(id, version);
                    if (!runtime && service.source !== 'disk') {
                        this.logger.info(`getByVersion:MissingRuntime`, {
                            version,
                            searchInService: service.source,
                        });
                        runtime = await this.diskStore.installFromService(id, version, service);
                    }
                    Object.assign(manifestWithLatest, runtime);
                    break;
                }
                catch (error) {
                    this.logger.warn(`getByVersion:ErrorInstallingRuntime`, {
                        version,
                        searchInService: service.source,
                        error,
                    });
                }
            }
        }
        if (manifestWithLatest)
            return manifestWithLatest;
        if (throwIfNotExists) {
            throw new errors_1.DatastoreNotFoundError(`Datastore version (${id}/v${version}) not found on Cloud.`, {
                latestVersion,
                version,
            });
        }
        return null;
    }
    async getLatestVersion(id) {
        for (const service of this.stores) {
            const latestVersion = await service.getLatestVersion(id);
            if (latestVersion)
                return latestVersion;
        }
    }
    async saveDbx(details, sourceHost, source = 'upload') {
        const { compressedDbx, adminIdentity, adminSignature } = details;
        const { cloudAdminIdentities, datastoresMustHaveOwnAdminIdentity, datastoresTmpDir } = this.config;
        const tmpDir = await fs_1.promises.mkdtemp(`${datastoresTmpDir}/`);
        try {
            await (0, dbxUtils_1.unpackDbx)(compressedDbx, tmpDir);
            return await this.save(tmpDir, {
                adminIdentity,
                hasServerAdminIdentity: cloudAdminIdentities.includes(adminIdentity ?? '-1'),
                datastoresMustHaveOwnAdminIdentity,
            }, {
                source,
                adminIdentity,
                adminSignature,
            });
        }
        finally {
            // remove tmp dir in case of errors
            await fs_1.promises.rm(tmpDir, { recursive: true }).catch(() => null);
        }
    }
    uploadToSourceOfTruth(datastore) {
        return this.clusterStore?.upload(datastore);
    }
    async save(datastoreTmpPath, adminDetails, uploaderSource) {
        adminDetails ??= {};
        return await this.diskStore.install(datastoreTmpPath, adminDetails, uploaderSource);
    }
    async startAtPath(dbxPath, sourceHost, watch) {
        return await this.diskStore.startAtPath(dbxPath, sourceHost, watch);
    }
    stopAtPath(dbxPath) {
        const datastore = this.diskStore.stopAtPath(dbxPath);
        if (datastore) {
            this.emit('stopped', {
                id: datastore.id,
                version: datastore.version,
            });
        }
    }
    async onDatastoreInstalled(version, source, previous, options) {
        await this.installCallbackFn?.(version, source?.source, previous, options);
        this.emit('new', {
            activity: source?.source === 'start' ? 'started' : 'uploaded',
            datastore: version,
        });
    }
}
exports.default = DatastoreRegistry;
//# sourceMappingURL=DatastoreRegistry.js.map