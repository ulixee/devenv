"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosts_1 = require("@ulixee/commons/config/hosts");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Fs = require("fs");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.upload.test');
let dbxFile;
let packager;
let manifest;
let cloudNode;
let client;
beforeAll(async () => {
    jest.spyOn(hosts_1.default.global, 'save').mockImplementation(() => null);
    if (Fs.existsSync(`${__dirname}/datastores/upload-manifest.json`)) {
        Fs.unlinkSync(`${__dirname}/datastores/upload-manifest.json`);
    }
    packager = new datastore_packager_1.default(`${__dirname}/datastores/upload.js`);
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
        },
    }, true);
    await Fs.promises.writeFile(`${__dirname}/datastores/upload-manifest.json`, JSON.stringify({
        version: '0.0.1',
    }));
    const dbx = await packager.build();
    dbxFile = await dbx.tarGzip();
    manifest = packager.manifest.toJSON();
    client = new DatastoreApiClient_1.default(await cloudNode.address, { consoleLogErrors: true });
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able upload a datastore', async () => {
    try {
        await client.upload(dbxFile);
        expect(Fs.existsSync(storageDir)).toBeTruthy();
        expect(manifest.schemaInterface).toBe(`{
  tables: {};
  extractors: {
    upTest: {
      output: {
        /**
         * Whether or not this test succeeded
         */
        upload: boolean;
      };
    };
  };
  crawlers: {};
}`);
        expect(Fs.existsSync(`${storageDir}/${manifest.id}@${manifest.version}.dbx`)).toBeTruthy();
    }
    catch (error) {
        console.log('TEST ERROR: ', error);
        throw error;
    }
});
test('should be able to restrict uploads', async () => {
    const identity = await Identity_1.default.create();
    cloudNode.datastoreCore.options.cloudAdminIdentities = [identity.bech32];
    await Fs.promises.writeFile(`${__dirname}/datastores/upload-manifest.json`, JSON.stringify({
        version: '0.0.2',
    }));
    const dbx = await packager.build();
    dbxFile = await dbx.tarGzip();
    manifest = packager.manifest.toJSON();
    await expect(client.upload(dbxFile)).rejects.toThrow('valid AdminIdentity signature');
    await expect(client.upload(dbxFile, { identity })).resolves.toBeTruthy();
});
test('should be able to download dbx files', async () => {
    const identity = await Identity_1.default.create();
    cloudNode.datastoreCore.options.cloudAdminIdentities = [identity.bech32];
    const wrongIdentity = await Identity_1.default.create();
    await expect(client.download(manifest.id, manifest.version, wrongIdentity)).rejects.toThrow('Admin Identity does not have permissions');
    await expect(client.download(manifest.id, manifest.version, identity)).resolves.toBeTruthy();
});
//# sourceMappingURL=Datastore.upload.test.js.map