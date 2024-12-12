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
var _DatastoreRegistryDiskStore_datastoresDb, _DatastoreRegistryDiskStore_openedManifestsByDbxPath;
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const VersionUtils_1 = require("@ulixee/commons/lib/VersionUtils");
const fs_1 = require("fs");
const nanoid_1 = require("nanoid");
const Path = require("path");
const db_1 = require("../db");
const DatastoreManifest_1 = require("./DatastoreManifest");
const DatastoreVm_1 = require("./DatastoreVm");
const dbxUtils_1 = require("./dbxUtils");
const errors_1 = require("./errors");
const datastorePackageJson = require(`../package.json`);
const { log } = (0, Logger_1.default)(module);
class DatastoreRegistryDiskStore {
    get datastoresDb() {
        __classPrivateFieldSet(this, _DatastoreRegistryDiskStore_datastoresDb, __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_datastoresDb, "f") ?? new db_1.default(this.datastoresDir), "f");
        return __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_datastoresDb, "f");
    }
    constructor(datastoresDir, isSourceOfTruth, defaultStorageEngineHost, onInstallCallbackFn) {
        this.datastoresDir = datastoresDir;
        this.isSourceOfTruth = isSourceOfTruth;
        this.defaultStorageEngineHost = defaultStorageEngineHost;
        this.onInstallCallbackFn = onInstallCallbackFn;
        this.source = 'disk';
        _DatastoreRegistryDiskStore_datastoresDb.set(this, void 0);
        _DatastoreRegistryDiskStore_openedManifestsByDbxPath.set(this, new Map());
    }
    close() {
        __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_datastoresDb, "f")?.close();
        __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_openedManifestsByDbxPath, "f").clear();
        __classPrivateFieldSet(this, _DatastoreRegistryDiskStore_datastoresDb, null, "f");
        return Promise.resolve();
    }
    async list(count, offset) {
        const results = [];
        const { datastores, total } = this.datastoresDb.versions.list(count, offset);
        for (const datastore of datastores) {
            const entry = await this.get(datastore.id, datastore.version);
            if (entry) {
                const { name, scriptEntrypoint, id, version, domain, description, versionTimestamp, isStarted, } = entry;
                results.push({
                    description,
                    id,
                    version,
                    versionTimestamp,
                    domain,
                    isStarted,
                    scriptEntrypoint,
                    name,
                });
            }
        }
        return { datastores: results, total };
    }
    async getVersions(id) {
        return this.datastoresDb.versions.getDatastoreVersions(id);
    }
    async get(id, version) {
        const versionRecord = this.datastoresDb.versions.get(id, version);
        if (!versionRecord?.dbxPath) {
            return null;
        }
        const dbxPath = versionRecord.dbxPath;
        const scriptPath = Path.join(dbxPath, 'datastore.js');
        let manifest = __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_openedManifestsByDbxPath, "f").get(dbxPath);
        if (!manifest) {
            const manifestPath = Path.join(dbxPath, 'datastore-manifest.json');
            manifest = await (0, fileUtils_1.readFileAsJson)(manifestPath).catch(() => null);
            if (manifest &&
                !DatastoreVm_1.default.doNotCacheList.has(scriptPath) &&
                !id.startsWith(DatastoreManifest_1.default.TemporaryIdPrefix)) {
                __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_openedManifestsByDbxPath, "f").set(dbxPath, manifest);
            }
        }
        if (!manifest)
            return null;
        const latestVersion = await this.getLatestVersion(id);
        return {
            ...manifest,
            isStarted: versionRecord.isStarted,
            latestVersion,
        };
    }
    getRuntime(id, version) {
        if (!version)
            return null;
        const versionRecord = this.datastoresDb.versions.get(id, version);
        if (!versionRecord?.dbxPath)
            return null;
        return Promise.resolve({
            runtimePath: Path.join(versionRecord.dbxPath, 'datastore.js'),
            isStarted: versionRecord.isStarted,
        });
    }
    async getCompressedDbx(id, version) {
        if (!version)
            return null;
        const versionRecord = this.datastoresDb.versions.get(id, version);
        if (!versionRecord?.dbxPath)
            return null;
        const compressedDbx = await (0, dbxUtils_1.packDbx)(versionRecord.dbxPath);
        return {
            compressedDbx,
            adminIdentity: versionRecord.adminIdentity,
            adminSignature: versionRecord.adminSignature,
        };
    }
    async installFromService(id, version, service) {
        const { compressedDbx, adminIdentity, adminSignature } = await service.downloadDbx(id, version);
        const tmpDir = Path.join(this.datastoresDir, `${version}.dbx.tmp.${(0, nanoid_1.nanoid)(3)}`);
        try {
            await fs_1.promises.mkdir(tmpDir, { recursive: true });
            await (0, dbxUtils_1.unpackDbx)(compressedDbx, tmpDir);
            await this.install(tmpDir, {
                hasServerAdminIdentity: true,
            }, {
                adminIdentity,
                adminSignature,
                source: service.source === 'cluster' ? 'cluster' : 'disk',
            });
        }
        finally {
            // remove tmp dir in case of errors
            await fs_1.promises.rm(tmpDir, { recursive: true }).catch(() => null);
        }
        return this.getRuntime(id, version);
    }
    async getPreviousInstalledVersion(id, version) {
        const previousVersions = this.datastoresDb.versions
            .getDatastoreVersions(id)
            .map(x => x.version)
            .filter(x => x.localeCompare(version, undefined, { numeric: true, sensitivity: 'base' }) < 0);
        if (previousVersions.length) {
            previousVersions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
            for (const previousVersion of previousVersions) {
                if (await this.get(id, previousVersion))
                    return previousVersion;
            }
        }
    }
    getLatestVersion(id) {
        const latestVersion = this.datastoresDb.versions.getLatestVersion(id);
        return Promise.resolve(latestVersion);
    }
    async install(datastoreTmpPath, adminOptions, sourceDetails) {
        if (!this.isSourceOfTruth && sourceDetails?.source === 'upload') {
            throw new Error('Installations cannot be made directly against this DatastoreRegistryService. This should have been redirected to a cluster leader or network endpoint.');
        }
        const manifest = await (0, fileUtils_1.readFileAsJson)(`${datastoreTmpPath}/datastore-manifest.json`);
        const storedPath = this.datastoresDb.versions.get(manifest.id, manifest.version)?.dbxPath;
        if (storedPath) {
            return { dbxPath: storedPath, manifest, didInstall: false };
        }
        if (!manifest.storageEngineHost && !!this.defaultStorageEngineHost) {
            throw new errors_1.MissingRequiredSettingError('This cloud requires a storage engine host to be specified.', 'storageEngineHost', this.defaultStorageEngineHost);
        }
        DatastoreManifest_1.default.validate(manifest);
        if (!manifest)
            throw new Error('Could not read the provided Datastore manifest.');
        this.checkDatastoreCoreInstalled(manifest.coreVersion);
        const dbxPath = this.createDbxPath(manifest);
        if (!adminOptions.hasServerAdminIdentity &&
            adminOptions.datastoresMustHaveOwnAdminIdentity &&
            !manifest.adminIdentities?.length) {
            throw new Error('This Cloud requires Datastores to include an AdminIdentity');
        }
        if (!adminOptions.hasServerAdminIdentity)
            await this.verifyAdminIdentity(manifest, adminOptions.adminIdentity);
        if (dbxPath !== datastoreTmpPath) {
            // remove any existing folder at dbxPath
            if (await (0, fileUtils_1.existsAsync)(dbxPath))
                await fs_1.promises.rm(dbxPath, { recursive: true });
            await fs_1.promises.rename(datastoreTmpPath, dbxPath);
        }
        __classPrivateFieldGet(this, _DatastoreRegistryDiskStore_openedManifestsByDbxPath, "f").set(dbxPath, manifest);
        this.saveManifestMetadata(manifest, dbxPath, sourceDetails);
        await this.onInstalled(manifest, sourceDetails);
        return { dbxPath, manifest, didInstall: true };
    }
    async installOnDiskUploads(cloudAdminIdentities) {
        const installations = [];
        if (!(await (0, fileUtils_1.existsAsync)(this.datastoresDir)))
            return installations;
        for (const filepath of await fs_1.promises.readdir(this.datastoresDir, { withFileTypes: true })) {
            const file = filepath.name;
            let path = Path.join(this.datastoresDir, file);
            if (!filepath.isDirectory()) {
                if (file.endsWith('.dbx.tgz')) {
                    if (!this.isSourceOfTruth) {
                        log.warn('A Datastore DBX was uploaded to this server, but this server cannot process installations. ' +
                            'If this Datastore was also uploaded to the cluster lead, this message can be ignored.', {
                            dbxPath: path,
                            sessionId: null,
                        });
                        continue;
                    }
                    const destPath = path.replace('.dbx.tgz', '.dbx');
                    if (!(await (0, fileUtils_1.existsAsync)(destPath))) {
                        await fs_1.promises.mkdir(destPath);
                        await (0, dbxUtils_1.unpackDbxFile)(path, destPath);
                    }
                    path = destPath;
                }
                else {
                    continue;
                }
            }
            if (!path.endsWith('.dbx')) {
                continue;
            }
            log.info('Found Datastore folder in datastores directory. Checking for import.', {
                file,
                sessionId: null,
            });
            try {
                const install = await this.install(path, {
                    hasServerAdminIdentity: true,
                }, {
                    adminIdentity: cloudAdminIdentities?.[0],
                    adminSignature: null,
                    source: 'disk',
                });
                if (install.didInstall) {
                    installations.push(install);
                    // move upload to same location
                    if (path !== install.dbxPath && (await (0, fileUtils_1.existsAsync)(`${path}.tgz`))) {
                        await fs_1.promises.rename(`${path}.tgz`, `${install.dbxPath}.tgz`);
                    }
                }
            }
            catch (err) {
                await fs_1.promises.rm(path, { recursive: true }).catch(() => null);
                throw err;
            }
        }
        return installations;
    }
    async startAtPath(dbxPath, sourceHost, watch) {
        const scriptPath = Path.join(dbxPath, 'datastore.js');
        if (!(await (0, fileUtils_1.existsAsync)(scriptPath)))
            throw new Error("This script entrypoint doesn't exist");
        const manifest = await (0, fileUtils_1.readFileAsJson)(`${dbxPath}/datastore-manifest.json`);
        this.checkDatastoreCoreInstalled(manifest.coreVersion);
        this.saveManifestMetadata(manifest, dbxPath);
        DatastoreVm_1.default.doNotCacheList.add(scriptPath);
        await this.onInstalled(manifest, { source: 'start' }, true, watch);
        return manifest;
    }
    stopAtPath(dbxPath) {
        return this.datastoresDb.versions.setDbxStopped(dbxPath);
    }
    recordPublished(id, version, timestamp) {
        this.datastoresDb.versions.recordPublishedToNetworkDate(id, version, timestamp);
    }
    async onInstalled(manifest, source, clearExisting, isWatching) {
        if (!this.onInstallCallbackFn)
            return;
        const id = manifest.id;
        try {
            const previousVersionNumber = await this.getPreviousInstalledVersion(id, manifest.version);
            const previousRuntime = await this.getRuntime(id, previousVersionNumber);
            const previousVersion = previousVersionNumber
                ? (await this.get(id, previousVersionNumber))
                : null;
            if (previousVersion)
                Object.assign(previousVersion, previousRuntime);
            const versionRuntime = await this.getRuntime(manifest.id, manifest.version);
            const latestVersion = await this.getLatestVersion(manifest.id);
            await this.onInstallCallbackFn({
                ...manifest,
                ...versionRuntime,
                latestVersion,
            }, source, previousVersion, { clearExisting, isWatching });
        }
        catch (err) {
            // if install callback fails, we need to rollback
            const record = this.datastoresDb.versions.delete(id, manifest.version);
            await fs_1.promises.rm(record.dbxPath, { recursive: true }).catch(() => null);
            throw err;
        }
    }
    async verifyAdminIdentity(manifest, adminIdentity) {
        // ensure admin is in the new list
        if (manifest.adminIdentities.length && !manifest.adminIdentities.includes(adminIdentity)) {
            if (adminIdentity)
                throw new errors_1.InvalidPermissionsError(`Your AdminIdentity is not authorized to upload Datastores to this Cloud (${adminIdentity}).`);
            else {
                throw new errors_1.InvalidPermissionsError(`You must sign this request with an AdminIdentity authorized for this Datastore or Cloud.`);
            }
        }
        // ensure admin is from the latest linked version
        const previousVersion = await this.getLatestVersion(manifest.id);
        if (previousVersion) {
            const previousVersionManifest = await this.get(manifest.id, previousVersion);
            // if there were admins, must be in previous list!
            if (previousVersionManifest &&
                previousVersionManifest.adminIdentities.length &&
                (!previousVersionManifest.adminIdentities.includes(adminIdentity) || !adminIdentity)) {
                throw new errors_1.InvalidPermissionsError('You are trying to overwrite a previous version of this Datastore with an AdminIdentity that was not present in the previous version.\n\n' +
                    'You must sign this version with a previous AdminIdentity, or use an authorized Server AdminIdentity.');
            }
        }
    }
    checkDatastoreCoreInstalled(requiredVersion) {
        const installedVersion = datastorePackageJson.version;
        if (!(0, VersionUtils_1.isSemverSatisfied)(requiredVersion, installedVersion)) {
            throw new Error(`The installed Datastore Core (${installedVersion}) is not compatible with the version required by your Datastore Package (${requiredVersion}).\n
Please try to re-upload after testing with the version available on this Cloud.`);
        }
    }
    createDbxPath(manifest) {
        return Path.resolve(this.datastoresDir, `${manifest.id}@${manifest.version}.dbx`);
    }
    saveManifestMetadata(manifest, dbxPath, source) {
        const existing = this.datastoresDb.versions.get(manifest.id, manifest.version);
        if (!existing) {
            this.datastoresDb.versions.save(manifest.id, manifest.version, manifest.scriptEntrypoint, manifest.versionTimestamp, dbxPath, source?.source, source?.adminIdentity, source?.adminSignature);
        }
        else {
            this.datastoresDb.versions.setDbxStarted(manifest.id, manifest.version);
        }
    }
}
_DatastoreRegistryDiskStore_datastoresDb = new WeakMap(), _DatastoreRegistryDiskStore_openedManifestsByDbxPath = new WeakMap();
exports.default = DatastoreRegistryDiskStore;
//# sourceMappingURL=DatastoreRegistryDiskStore.js.map