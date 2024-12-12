"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const __1 = require("..");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Client.query.test');
let cloudNode;
let apiClient;
beforeAll(async () => {
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
        },
    });
    apiClient = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => apiClient.disconnect(), true);
});
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to query a datastore using sql', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/query.js`);
    await packager.build({ createTemporaryVersion: true });
    await expect(apiClient.upload(await packager.dbx.tarGzip())).resolves.toBeTruthy();
    const cloudNodeAddress = await cloudNode.address;
    const client = new __1.default(`ulx://${cloudNodeAddress}/${packager.manifest.id}@v${packager.manifest.version}`);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    const results = await client.query('SELECT * FROM test(shouldTest => $1) LEFT JOIN testers on testers.lastName=test.lastName', [true]);
    await client.disconnect();
    expect(results).toEqual([
        {
            testerEcho: true,
            lastName: 'Clark',
            greeting: 'Hello world',
            firstName: 'Caleb',
            testerNumber: 1n,
        },
    ]);
});
//# sourceMappingURL=query.test.js.map