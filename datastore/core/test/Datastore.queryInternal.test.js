"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosts_1 = require("@ulixee/commons/config/hosts");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Fs = require("fs");
const Path = require("path");
const direct_1 = require("./datastores/direct");
const directExtractorInternal_1 = require("./datastores/directExtractorInternal");
const directTable_1 = require("./datastores/directTable");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.queryInternal.test');
let cloudNode;
const storages = [];
beforeAll(async () => {
    jest.spyOn(hosts_1.default.global, 'save').mockImplementation(() => null);
    for (const dbx of ['directExtractorInternal', 'direct', 'directTable']) {
        if (Fs.existsSync(`${__dirname}/datastores/${dbx}.dbx`)) {
            await Fs.promises.rm(`${__dirname}/datastores/${dbx}.dbx`, { recursive: true });
        }
    }
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: { datastoresDir: storageDir },
    }, true);
    const storage1 = (await direct_1.default.bind({})).storageEngine;
    const storage2 = (await directExtractorInternal_1.default.bind({})).storageEngine;
    const storage3 = (await directTable_1.default.bind({})).storageEngine;
    storages.push(storage1, storage2, storage3);
});
afterAll(async () => {
    for (const storage of storages)
        await storage.close();
    await datastore_testing_1.Helpers.afterAll();
});
test('query datastore table', async () => {
    const records = await direct_1.default.queryInternal('SELECT * FROM testers');
    expect(records).toMatchObject([
        { firstName: 'Caleb', lastName: 'Clark', isTester: true },
        { firstName: 'Blake', lastName: 'Byrnes', isTester: null },
    ]);
}, 30e3);
test('query datastore extractor', async () => {
    const records = await direct_1.default.queryInternal('SELECT * FROM test(shouldTest => true)');
    expect(records).toMatchObject([
        {
            testerEcho: true,
            greeting: 'Hello world',
        },
    ]);
}, 30e3);
test('query specific fields on extractor', async () => {
    const records = await direct_1.default.queryInternal('SELECT greeting FROM test(shouldTest => true)');
    expect(records).toMatchObject([
        {
            greeting: 'Hello world',
        },
    ]);
}, 30e3);
test('left join table on extractors', async () => {
    const sql = `SELECT greeting, firstName FROM test(shouldTest => true) LEFT JOIN testers ON testers.isTester=test.shouldTest`;
    const records = await direct_1.default.queryInternal(sql);
    expect(records).toMatchObject([
        {
            greeting: 'Hello world',
            firstName: 'Caleb',
        },
    ]);
}, 30e3);
test('should be able to query function directly', async () => {
    const data = await directExtractorInternal_1.default.queryInternal('SELECT * FROM self(tester => true)');
    expect(data).toMatchObject([{ testerEcho: true }]);
}, 30e3);
test('should be able to query table directly', async () => {
    const data = await directTable_1.default.queryInternal('SELECT * FROM self');
    expect(data).toMatchObject([
        { title: 'Hello', success: true },
        { title: 'World', success: false },
    ]);
});
//# sourceMappingURL=Datastore.queryInternal.test.js.map