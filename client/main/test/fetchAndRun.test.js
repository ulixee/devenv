"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Path = require("path");
const __1 = require("..");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Client.fetch.test');
let cloudNode;
let apiClient;
let packager;
beforeAll(async () => {
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
        },
    });
    packager = new datastore_packager_1.default(`${__dirname}/datastores/fetch.js`);
    await packager.build({ createTemporaryVersion: true });
    apiClient = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => apiClient.disconnect(), true);
    await apiClient.upload(await packager.dbx.tarGzip());
});
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to fetch a datastore table', async () => {
    const cloudNodeAddress = await cloudNode.address;
    const client = new __1.default(`ulx://${cloudNodeAddress}/${packager.manifest.id}@v${packager.manifest.version}`);
    const results = await client.fetch('testers');
    expect(results).toEqual([
        { firstName: 'Caleb', lastName: 'Clark', isTester: true },
        { firstName: 'Blake', lastName: 'Byrnes', isTester: null },
    ]);
});
test('should be able to run a datastore extractor', async () => {
    const cloudNodeAddress = await cloudNode.address;
    const client = new __1.default(`ulx://${cloudNodeAddress}/${packager.manifest.id}@v${packager.manifest.version}`);
    const results = await client.run('test', { shouldTest: true });
    expect(results).toEqual([{ testerEcho: true, greeting: 'Hello world' }]);
});
//# sourceMappingURL=fetchAndRun.test.js.map