"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Path = require("path");
const DatastoreRegistry_1 = require("../lib/DatastoreRegistry");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastoreCore.test');
let bootupPackager;
let bootupDbx;
let cloudNode;
let client;
beforeAll(async () => {
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
        },
    }, true);
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
    bootupPackager = new datastore_packager_1.default(require.resolve('./datastores/bootup.ts'));
    bootupDbx = await bootupPackager.build();
}, 60e3);
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
test('should install new datastores on startup', async () => {
    await (0, fileUtils_1.copyDir)(bootupDbx.path, `${storageDir}/bootup.dbx`);
    const registry = new DatastoreRegistry_1.default(storageDir);
    await registry.diskStore.installOnDiskUploads([]);
    // @ts-expect-error
    const entry = registry.diskStore.datastoresDb.versions.get(bootupPackager.manifest.id, bootupPackager.manifest.version);
    expect(entry).toBeTruthy();
    await expect((0, fileUtils_1.existsAsync)(entry.dbxPath)).resolves.toBeTruthy();
}, 45e3);
test('can get metadata about an uploaded datastore', async () => {
    await client.upload(await bootupDbx.tarGzip()).catch(() => null);
    const meta = await client.getMeta(bootupPackager.manifest.id, bootupPackager.manifest.version);
    expect(meta.version).toBe(bootupPackager.manifest.version);
    expect(meta.scriptEntrypoint).toBe(bootupPackager.manifest.scriptEntrypoint);
    expect(meta.stats).toBeTruthy();
    expect(meta.extractorsByName.bootup).toBeTruthy();
    expect(meta.schemaInterface).toBe(`{
  tables: {};
  extractors: {
    bootup: {
      output: {
        "is-valid"?: boolean;
        success: boolean;
      };
    };
  };
  crawlers: {};
}`);
});
//# sourceMappingURL=DatastoreCore.test.js.map