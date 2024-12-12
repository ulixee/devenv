"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const cloneDatastore_1 = require("@ulixee/datastore/cli/cloneDatastore");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Fs = require("fs");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.clone.test');
let cloudNode;
let client;
let version;
let datastoreId;
beforeAll(async () => {
    if (Fs.existsSync(`${__dirname}/datastores/cloneme.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/cloneme.dbx`, { recursive: true });
    }
    if (Fs.existsSync(`${__dirname}/datastores/cloned.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/cloned.dbx`, { recursive: true });
    }
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
        },
    }, true);
    client = new DatastoreApiClient_1.default(await cloudNode.address, { consoleLogErrors: true });
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/cloneme.ts`);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    version = packager.manifest.version;
    datastoreId = packager.manifest.id;
}, 45e3);
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to clone a datastore', async () => {
    const url = `ulx://${await cloudNode.address}/${datastoreId}@v${version}`;
    await expect((0, cloneDatastore_1.default)(url, `${__dirname}/datastores/cloned`)).resolves.toEqual({
        datastoreFilePath: Path.join(__dirname, 'datastores', 'cloned', 'datastore.ts'),
    });
    expect(Fs.existsSync(`${__dirname}/datastores/cloned/datastore.ts`)).toBeTruthy();
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/cloned/datastore.ts`);
    await packager.build({ createTemporaryVersion: true });
    await client.upload(await packager.dbx.tarGzip());
    // should not include a private table
    expect(Object.entries(packager.manifest.tablesByName)).toHaveLength(1);
    expect(packager.manifest.tablesByName.private).not.toBeTruthy();
    expect(packager.manifest.tablesByName.users.schemaAsJson).toEqual({
        name: { typeName: 'string' },
        birthdate: { typeName: 'date' },
    });
    expect(Object.entries(packager.manifest.extractorsByName)).toHaveLength(1);
    expect(packager.manifest.extractorsByName.cloneUpstream.schemaAsJson).toEqual({
        input: {
            field: { typeName: 'string', minLength: 1, description: 'a field you should use' },
            nested: {
                typeName: 'object',
                fields: {
                    field2: { typeName: 'boolean' },
                },
                optional: true,
            },
        },
        output: {
            success: { typeName: 'boolean' },
            affiliateId: { typeName: 'string' },
        },
    });
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'cloneUpstream', {})).rejects.toThrow('input');
    await expect(client.stream(packager.manifest.id, packager.manifest.version, 'cloneUpstream', {
        field: 'str',
        nested: { field2: true },
    })).resolves.toEqual([{ success: true, affiliateId: expect.any(String) }]);
    // can query the passthrough table
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from users', {
        queryId: 'queryTest'
    })).resolves.toEqual({
        metadata: expect.any(Object),
        outputs: [{ name: 'me', birthdate: expect.any(Date) }],
        latestVersion: packager.manifest.version,
        queryId: "queryTest"
    });
}, 45e3);
//# sourceMappingURL=Datastore.clone.test.js.map