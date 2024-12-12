"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const Helpers = require("@ulixee/datastore-testing/helpers");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const axios_1 = require("axios");
const Fs = require("fs");
const Path = require("path");
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.docpage.test');
let dbxFile;
let cloudNode;
let manifest;
let client;
const adminIdentity = Identity_1.default.createSync();
beforeAll(async () => {
    Helpers.blockGlobalConfigWrites();
    if (Fs.existsSync(`${__dirname}/datastores/docpage.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/docpage.dbx`, { recursive: true });
    }
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/docpage.js`);
    await packager.build();
    dbxFile = await packager.dbx.tarGzip();
    manifest = packager.manifest.toJSON();
    cloudNode = await Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            cloudAdminIdentities: [adminIdentity.bech32],
        },
    }, true);
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    await client.upload(dbxFile, { identity: adminIdentity });
});
afterEach(Helpers.afterEach);
afterAll(async () => {
    await Helpers.afterAll();
});
test('should be able to load datastore documentation', async () => {
    const address = await cloudNode.address;
    const res = await axios_1.default.get(`http://${address}/${manifest.id}@v${manifest.version}`);
    expect(res.data.includes('<title>Ulixee</title>')).toBe(true);
    const config = await axios_1.default.get(`http://${address}/${manifest.id}@v${manifest.version}/docpage.json`);
    expect(config.data.name).toBe('Docpage');
});
test('should be able to load datastore documentation with a credit hash', async () => {
    const address = await cloudNode.address;
    const res = await axios_1.default.get(`http://${address}/${manifest.id}@v${manifest.version}?crd2342342`);
    expect(res.data.includes('<title>Ulixee</title>')).toBe(true);
    const config = await axios_1.default.get(`http://${address}/${manifest.id}@v${manifest.version}/docpage.json`);
    expect(config.data.name).toBe('Docpage');
});
test('should be able to get a credit balance', async () => {
    const credits = await client.createCredits(manifest.id, manifest.version, 1002n, adminIdentity);
    await expect(axios_1.default.get(`http://${await cloudNode.address}/${manifest.id}@v${manifest.version}/free-credit?${credits.id}:${credits.secret}`, { responseType: 'text', headers: { accept: 'application/json' } }).then(x => TypeSerializer_1.default.parse(x.data))).resolves.toEqual({
        balance: 1002n,
        issuedCredits: 1002n,
    });
});
test('should be able to parse datastore urls', async () => {
    const expectedOutput = {
        host: await cloudNode.address,
        datastoreId: manifest.id,
        version: manifest.version,
        domain: null,
    };
    await expect(DatastoreApiClient_1.default.lookupDatastoreHost(`${await cloudNode.address}/${manifest.id}@v${manifest.version}/free-credit?crd2342342:234234333`, null)).resolves.toEqual(expectedOutput);
    await expect(DatastoreApiClient_1.default.lookupDatastoreHost(`${await cloudNode.address}/${manifest.id}@v${manifest.version}`, null)).resolves.toEqual(expectedOutput);
    await expect(DatastoreApiClient_1.default.lookupDatastoreHost(`localhost:52759/i-am-a-datastore@v2.0.0`, null)).resolves.toEqual({
        host: 'localhost:52759',
        datastoreId: 'i-am-a-datastore',
        version: '2.0.0',
        domain: null,
    });
    await expect(DatastoreApiClient_1.default.lookupDatastoreHost(`ulx://${await cloudNode.address}/${manifest.id}@v${manifest.version}/free-credit/?crd2342342:234234333`, null)).resolves.toEqual(expectedOutput);
});
//# sourceMappingURL=Docpage.test.js.map