"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Fs = require("fs");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.stream.test');
let cloudNode;
let client;
beforeAll(async () => {
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
        },
    }, true);
    await Fs.promises.rm(`${__dirname}/datastores/stream.dbx`, { recursive: true }).catch(() => null);
    if (Fs.existsSync(`${__dirname}/datastores/stream-manifest.json`)) {
        Fs.unlinkSync(`${__dirname}/datastores/stream-manifest.json`);
    }
    await cloudNode.listen();
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
});
afterAll(async () => {
    await datastore_testing_1.Helpers.afterAll();
});
test('should be able to stream a datastore extractor', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/stream.js`);
    await Fs.promises.writeFile(`${__dirname}/datastores/stream-manifest.json`, JSON.stringify({
        version: '0.0.1',
    }));
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    let counter = 0;
    const outputs = [];
    const result = client.stream(packager.manifest.id, packager.manifest.version, 'streamer', {});
    await expect(result.resultMetadata).resolves.toEqual(expect.objectContaining({
        metadata: {
            milliseconds: expect.any(Number),
            bytes: expect.any(Number),
            microgons: 0n,
        },
        latestVersion: expect.any(String),
        queryId: expect.any(String),
    }));
    for await (const record of result) {
        counter += 1;
        outputs.push(record);
    }
    expect(counter).toBe(3);
    expect(outputs).toEqual([{ record: 0 }, { record: 1 }, { record: 2 }]);
});
test('should be able to stream a datastore table', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/stream.js`);
    await Fs.promises.writeFile(`${__dirname}/datastores/stream-manifest.json`, JSON.stringify({
        version: '0.0.2',
    }));
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    let counter = 0;
    const outputs = [];
    const result = client.stream(packager.manifest.id, packager.manifest.version, 'streamTable', {
        success: false,
    });
    await expect(result.resultMetadata).resolves.toEqual({
        metadata: {
            milliseconds: expect.any(Number),
            bytes: expect.any(Number),
            microgons: 0n,
        },
        latestVersion: expect.any(String),
        queryId: expect.any(String),
    });
    for await (const record of result) {
        counter += 1;
        outputs.push(record);
    }
    expect(counter).toBe(1);
    expect(outputs).toEqual([{ title: 'World', success: false }]);
});
test('should be able to require authentication for a streamed extractor', async () => {
    const id = Identity_1.default.createSync();
    Fs.writeFileSync(`${__dirname}/datastores/streamedAuth.js`, Fs.readFileSync(`${__dirname}/datastores/streamedAuth.js`, 'utf8').replace(/const allowedId = 'id1.+';/, `const allowedId = '${id.bech32}';`));
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/streamedAuth.js`);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    const auth = DatastoreApiClient_1.default.createExecAuthentication(null, id);
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'authme', {})).rejects.toThrow('authentication');
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'authme', {}, { authentication: auth })).resolves.toBeTruthy();
});
//# sourceMappingURL=Datastore.stream.test.js.map