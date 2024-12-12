"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const Path = require("path");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.query.test');
let cloudNode;
let client;
beforeAll(async () => {
    if (Fs.existsSync(`${__dirname}/datastores/query.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/query.dbx`, { recursive: true });
    }
    if (Fs.existsSync(`${__dirname}/datastores/directExtractor.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/directExtractor.dbx`, { recursive: true });
    }
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
        },
    }, true);
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to query a datastore extractor', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/query.js`);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'SELECT success FROM query()')).resolves.toEqual({
        outputs: [{ success: true }],
        queryId: expect.any(String),
        metadata: expect.any(Object),
        latestVersion: expect.any(String),
    });
});
test('should be able to require authentication for a datastore', async () => {
    const id = Identity_1.default.createSync();
    Fs.writeFileSync(`${__dirname}/datastores/auth.js`, Fs.readFileSync(`${__dirname}/datastores/auth.js`, 'utf8').replace(/const allowedId = 'id1.+';/, `const allowedId = '${id.bech32}';`));
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/auth.js`);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    const auth = DatastoreApiClient_1.default.createExecAuthentication(null, id);
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from authme()')).rejects.toThrow('authentication');
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from authme()', { authentication: auth })).resolves.toBeTruthy();
});
test('should be able to query a function packaged without a datastore', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/directExtractor.js`);
    await packager.build({ createTemporaryVersion: true });
    await client.upload(await packager.dbx.tarGzip());
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'SELECT testerEcho FROM default(tester => $1)', {
        boundValues: [false],
    })).resolves.toEqual({
        outputs: [{ testerEcho: false }],
        queryId: expect.any(String),
        metadata: expect.any(Object),
        latestVersion: expect.any(String),
    });
});
//# sourceMappingURL=Datastore.query.test.js.map