"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Path = require("path");
const moment = require("moment");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastoreVm.test');
const tmpDir = `${storageDir}/tmp`;
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
}, 30e3);
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('can run a Datastore with momentjs', async () => {
    const packager = new datastore_packager_1.default(require.resolve('./datastores/moment.ts'));
    const dbx = await packager.build();
    await dbx.upload(await cloudNode.address);
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'moment', {
        date: '2021/02/01',
    })).rejects.toThrow('input did not match its Schema');
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'moment', {
        date: '2021-02-01',
    })).resolves.toEqual([{ date: moment('2021-02-01').toDate() }]);
}, 45e3);
test('can get the stack trace of a compiled datastore', async () => {
    const packager = new datastore_packager_1.default(require.resolve('./datastores/errorStackDatastore.ts'));
    const dbx = await packager.build();
    await dbx.upload(await cloudNode.address);
    const expectedPath = Path.join(`${packager.manifest.id}@${packager.manifest.version}.dbx`, 'datastore', 'core', 'test', 'datastores', 'errorStack.ts');
    try {
        await client.stream(packager.manifest.id, packager.manifest.version, 'errorStack', {});
    }
    catch (error) {
        expect(error.stack).toContain(`at multiply (${expectedPath}:15:25)`);
    }
}, 45e3);
//# sourceMappingURL=DatastoreVm.test.js.map