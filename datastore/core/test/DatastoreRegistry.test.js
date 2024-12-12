"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const HashUtils = require("@ulixee/commons/lib/hashUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const fs_1 = require("fs");
const Path = require("path");
const DatastoreRegistry_1 = require("../lib/DatastoreRegistry");
const errors_1 = require("../lib/errors");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastoreRegistry.test');
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(async () => {
    await datastore_testing_1.Helpers.afterAll();
    if ((0, fs_1.existsSync)(storageDir))
        (0, fs_1.rmSync)(storageDir, { recursive: true });
});
function hashScript(script) {
    const sha = HashUtils.sha256(script);
    return (0, bufferUtils_1.encodeBuffer)(sha, 'scr');
}
test('should throw an error if the required datastore core version is not installed', async () => {
    const registry = new DatastoreRegistry_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(registry);
    const datastoreTmpDir = `${storageDir}/tmp/dbx1`;
    (0, fs_1.mkdirSync)(datastoreTmpDir, { recursive: true });
    await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify({
        id: `id`,
        version: '0.0.1',
        scriptHash: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('scr123'), 'scr'),
        coreVersion: '5.0.0',
        versionTimestamp: Date.now(),
        extractorsByName: {},
        crawlersByName: {},
        tablesByName: {},
        scriptEntrypoint: 'here.js',
        adminIdentities: [],
    }));
    await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore.js`, 'function(){}');
    await expect(registry.save(datastoreTmpDir)).rejects.toThrow('not compatible with the version required by your Datastore');
});
test('should be able to upload and retrieve the datastore', async () => {
    const registry = new DatastoreRegistry_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(registry);
    const script = 'function(){}';
    const scriptHash = hashScript(script);
    const datastoreTmpDir = `${storageDir}/tmp/dbx2`;
    (0, fs_1.mkdirSync)(datastoreTmpDir, { recursive: true });
    const versionTimestamp = Date.now();
    await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify({
        scriptHash,
        versionTimestamp,
        id: `id`,
        version: '0.0.1',
        coreVersion: '2.0.0-alpha.1',
        scriptEntrypoint: 'here.js',
        extractorsByName: { default: {} },
        crawlersByName: {},
        tablesByName: {},
        adminIdentities: [],
    }));
    await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore.js`, script);
    await expect(registry.save(datastoreTmpDir)).resolves.toBeTruthy();
    const uploaded = await registry.get('id', '0.0.1');
    expect(uploaded).toBeTruthy();
    expect((0, fs_1.readFileSync)(uploaded.runtimePath, 'utf8')).toBe(script);
});
test('should provide a newer version hash if old script not available', async () => {
    const registry = new DatastoreRegistry_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(registry);
    // @ts-expect-error
    const versions = registry.diskStore.datastoresDb.versions;
    versions.save('idx', '0.0.1', './new-version.ts', Date.now(), './new-version.ts', 'disk', null, null);
    versions.save('idx', '0.0.2', './new-version.ts', Date.now(), './new-version.ts', 'disk', null, null);
    try {
        await registry.get('idx', '0.0.1');
    }
    catch (e) {
        expect(e).toBeInstanceOf(errors_1.DatastoreNotFoundError);
        expect(e.data?.latestVersion).toBe('0.0.2');
    }
});
test('should require a new upload to be signed by a previous admin identity', async () => {
    const datastoreTmpDir = `${storageDir}/tmp/testSigned`;
    datastore_testing_1.Helpers.needsClosing.push({
        close: () => (0, fs_1.existsSync)(datastoreTmpDir) && (0, fs_1.rmSync)(datastoreTmpDir),
        onlyCloseOnFinal: false,
    });
    const registry = new DatastoreRegistry_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(registry);
    const identity = Identity_1.default.createSync();
    {
        await fs_1.promises.mkdir(datastoreTmpDir, { recursive: true });
        const script = 'function 1(){}';
        const manifest = {
            coreVersion: '2.0.0-alpha.1',
            scriptEntrypoint: 'signed.js',
            versionTimestamp: Date.now(),
            scriptHash: hashScript(script),
            id: 'first',
            version: '0.0.1',
            extractorsByName: { default: {} },
            crawlersByName: {},
            tablesByName: {},
            adminIdentities: [identity.bech32],
        };
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify(manifest));
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore.js`, script);
        await expect(registry.save(datastoreTmpDir, { adminIdentity: identity.bech32 })).resolves.toBeTruthy();
    }
    {
        await fs_1.promises.mkdir(datastoreTmpDir, { recursive: true });
        const script = 'function 2(){}';
        const manifest = {
            coreVersion: '2.0.0-alpha.1',
            scriptEntrypoint: 'signed.js',
            scriptHash: hashScript(script),
            versionTimestamp: Date.now(),
            extractorsByName: { default: {} },
            crawlersByName: {},
            tablesByName: {},
            id: 'first',
            version: '0.0.2',
            adminIdentities: [],
        };
        // TEST 1: don't sign upload
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify(manifest));
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore.js`, script);
        // can't pass in no identity
        await expect(registry.save(datastoreTmpDir)).rejects.toThrow('You are trying to overwrite a previous version of this Datastore with an AdminIdentity that was not present in the previous version');
        const adminOverwriteAttempt = Identity_1.default.createSync();
        // TEST 2: try to sign empty list with a new identity
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify(manifest));
        await expect(registry.save(datastoreTmpDir, { adminIdentity: adminOverwriteAttempt.bech32 })).rejects.toThrow('You are trying to overwrite a previous version of this Datastore with an AdminIdentity that was not present in the previous version');
        // TEST 3: replace admins with a new list
        manifest.adminIdentities = [adminOverwriteAttempt.bech32];
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify(manifest));
        // can't just overwrite the admins without a previous one
        await expect(registry.save(datastoreTmpDir, { adminIdentity: adminOverwriteAttempt.bech32 })).rejects.toThrow('You are trying to overwrite a previous version of this Datastore with an AdminIdentity that was not present in the previous version');
        // TEST 4: replace list and sign with old identity
        manifest.adminIdentities = [adminOverwriteAttempt.bech32, identity.bech32];
        await fs_1.promises.writeFile(`${datastoreTmpDir}/datastore-manifest.json`, JSON.stringify(manifest));
        await expect(registry.save(datastoreTmpDir, { adminIdentity: identity.bech32 })).resolves.toBeTruthy();
    }
});
//# sourceMappingURL=DatastoreRegistry.test.js.map