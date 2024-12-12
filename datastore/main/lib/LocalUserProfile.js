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
var _LocalUserProfile_defaultAdminIdentity;
Object.defineProperty(exports, "__esModule", { value: true });
const dirUtils_1 = require("@ulixee/commons/lib/dirUtils");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const Fs = require("fs");
const fs_1 = require("fs");
const Path = require("path");
class LocalUserProfile {
    get defaultAdminIdentity() {
        if (this.defaultAdminIdentityPath) {
            __classPrivateFieldSet(this, _LocalUserProfile_defaultAdminIdentity, __classPrivateFieldGet(this, _LocalUserProfile_defaultAdminIdentity, "f") ?? Identity_1.default.loadFromFile(this.defaultAdminIdentityPath), "f");
            return __classPrivateFieldGet(this, _LocalUserProfile_defaultAdminIdentity, "f");
        }
    }
    constructor() {
        this.clouds = [];
        this.databrokers = [];
        this.localchains = [];
        this.localchainForQueryName = 'primary';
        this.installedDatastores = [];
        this.datastoreAdminIdentities = [];
        this.gettingStartedCompletedSteps = [];
        _LocalUserProfile_defaultAdminIdentity.set(this, void 0);
        this.loadProfile();
    }
    async setDatastoreAdminIdentity(datastoreId, adminIdentityPath) {
        let existing = this.datastoreAdminIdentities.find(x => x.datastoreId === datastoreId);
        if (!existing) {
            existing = { datastoreId, adminIdentityPath };
            this.datastoreAdminIdentities.push(existing);
        }
        existing.adminIdentityPath = adminIdentityPath;
        existing.adminIdentity = Identity_1.default.loadFromFile(adminIdentityPath)?.bech32;
        await this.save();
        return existing.adminIdentity;
    }
    async setCloudAdminIdentity(cloudName, adminIdentityPath) {
        if (cloudName === 'local') {
            this.defaultAdminIdentityPath = adminIdentityPath;
            __classPrivateFieldSet(this, _LocalUserProfile_defaultAdminIdentity, null, "f");
            return this.defaultAdminIdentity.bech32;
        }
        const existing = this.clouds.find(x => x.name === cloudName);
        existing.adminIdentityPath = adminIdentityPath;
        existing.adminIdentity = Identity_1.default.loadFromFile(adminIdentityPath)?.bech32;
        await this.save();
        return existing.adminIdentity;
    }
    getAdminIdentity(datastoreId, cloudName) {
        const datastoreAdmin = this.datastoreAdminIdentities.find(x => x.datastoreId === datastoreId);
        if (datastoreAdmin?.adminIdentityPath)
            return Identity_1.default.loadFromFile(datastoreAdmin.adminIdentityPath);
        if (cloudName === 'local')
            return this.defaultAdminIdentity;
        const cloud = this.clouds.find(x => x.name === cloudName);
        if (cloud?.adminIdentityPath)
            return Identity_1.default.loadFromFile(cloud.adminIdentityPath);
    }
    async createDefaultAdminIdentity() {
        this.defaultAdminIdentityPath = Path.join((0, dirUtils_1.getDataDirectory)(), 'ulixee', 'identities', 'adminIdentity.pem');
        if ((0, fs_1.existsSync)(this.defaultAdminIdentityPath)) {
            const identity = Identity_1.default.loadFromFile(this.defaultAdminIdentityPath);
            await this.save();
            return identity.bech32;
        }
        const identity = await Identity_1.default.create();
        await identity.save(this.defaultAdminIdentityPath);
        return identity.bech32;
    }
    async installDatastore(cloudHost, datastoreId, datastoreVersion) {
        if (!this.installedDatastores.some(x => x.cloudHost === cloudHost &&
            x.datastoreId === datastoreId &&
            x.datastoreVersion === datastoreVersion)) {
            this.installedDatastores.push({ datastoreId, cloudHost, datastoreVersion });
            await this.save();
        }
    }
    async uninstallDatastore(cloudHost, datastoreId, datastoreVersion) {
        const index = this.installedDatastores.findIndex(x => x.cloudHost === cloudHost &&
            x.datastoreId === datastoreId &&
            x.datastoreVersion === datastoreVersion);
        if (index >= 0) {
            this.installedDatastores.splice(index, 1);
            await this.save();
        }
    }
    async save() {
        await (0, fileUtils_1.safeOverwriteFile)(LocalUserProfile.path, TypeSerializer_1.default.stringify(this.toJSON()));
    }
    toJSON() {
        return {
            clouds: this.clouds,
            installedDatastores: this.installedDatastores,
            defaultAdminIdentityPath: this.defaultAdminIdentityPath,
            gettingStartedCompletedSteps: this.gettingStartedCompletedSteps,
            datastoreAdminIdentities: this.datastoreAdminIdentities.map(x => ({
                adminIdentityPath: x.adminIdentityPath,
                datastoreId: x.datastoreId,
            })),
            localchains: this.localchains,
            databrokers: this.databrokers,
            localchainForQueryName: this.localchainForQueryName,
            localchainForCloudNodeName: this.localchainForCloudNodeName,
        };
    }
    loadProfile() {
        if (!Fs.existsSync(LocalUserProfile.path))
            return;
        try {
            const data = TypeSerializer_1.default.parse(Fs.readFileSync(LocalUserProfile.path, 'utf8'));
            Object.assign(this, data);
            this.clouds ??= [];
            for (const cloud of this.clouds) {
                if (cloud.adminIdentityPath) {
                    cloud.adminIdentity = Identity_1.default.loadFromFile(cloud.adminIdentityPath).bech32;
                }
            }
            this.datastoreAdminIdentities ??= [];
            this.gettingStartedCompletedSteps ??= [];
            this.installedDatastores ??= [];
            this.localchains ??= [];
            this.databrokers ??= [];
        }
        catch { }
    }
}
_LocalUserProfile_defaultAdminIdentity = new WeakMap();
LocalUserProfile.path = Path.join((0, dirUtils_1.getDataDirectory)(), 'ulixee', 'user-profile.json');
exports.default = LocalUserProfile;
//# sourceMappingURL=LocalUserProfile.js.map