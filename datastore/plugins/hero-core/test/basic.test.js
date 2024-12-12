"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Fs = require("fs");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'hero-core/basic.test');
let cloudNode;
let koaServer;
let packager;
let host;
beforeAll(async () => {
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
        },
    }, true);
    koaServer = await datastore_testing_1.Helpers.runKoaServer();
    if (Fs.existsSync(`${__dirname}/_testDatastore.dbx`))
        await Fs.promises.rm(`${__dirname}/_testDatastore.dbx`, { recursive: true });
    packager = new datastore_packager_1.default(require.resolve('./_testDatastore.js'));
    const dbx = await packager.build({ createTemporaryVersion: true });
    host = await cloudNode.address;
    await dbx.upload(host);
    koaServer.get('/datastore', ctx => {
        ctx.body = `<html><head><title>Datastore!</title></head><body><h1>Visible</h1></body></html>`;
    });
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('it should be able to upload a datastore and run it by hash', async () => {
    const statsTracker = cloudNode.datastoreCore.statsTracker;
    const { queryLogDb, statsDb } = statsTracker.diskStore;
    const manifest = packager.manifest;
    const remoteTransport = datastore_1.ConnectionToDatastoreCore.remote(host);
    datastore_testing_1.Helpers.onClose(() => remoteTransport.disconnect());
    await expect(remoteTransport.sendRequest({
        command: 'Datastore.query',
        args: [
            {
                queryId: 'query1',
                sql: 'SELECT title FROM default(url => $1)',
                boundValues: [`${koaServer.baseUrl}/datastore`],
                id: manifest.id,
                version: manifest.version,
            },
        ],
    })).resolves.toEqual({
        metadata: expect.any(Object),
        outputs: [{ title: 'Datastore!' }],
        latestVersion: manifest.version,
    });
    expect(queryLogDb.logTable.all()).toHaveLength(1);
    expect(queryLogDb.logTable.all()[0].query).toBe(`SELECT title FROM default(url => $1)`);
    const heroSessionIds = JSON.parse(queryLogDb.logTable.all()[0].heroSessionIds);
    expect(heroSessionIds).toHaveLength(2);
    const stats = statsDb.datastoreEntities.all();
    expect(stats).toHaveLength(2);
    expect(stats.some(x => x.name === 'default')).toBeTruthy();
    expect(stats.some(x => x.name === 'defaultCrawl')).toBeTruthy();
}, 45e3);
test('it should be able to capture stack origins', async () => {
    const manifest = packager.manifest;
    const remoteTransport = datastore_1.ConnectionToDatastoreCore.remote(host);
    datastore_testing_1.Helpers.onClose(() => remoteTransport.disconnect());
    const heroSession = await remoteTransport.sendRequest({
        command: 'Datastore.query',
        args: [
            {
                queryId: 'query1',
                sql: 'SELECT * FROM defaultCrawl(url => $1)',
                boundValues: [`${koaServer.baseUrl}/datastore`],
                id: manifest.id,
                version: manifest.version,
            },
        ],
    });
    expect(heroSession.outputs[0].sessionId).toBeTruthy();
    const db = await cloudNode.heroCore.sessionRegistry.get(heroSession.outputs[0].sessionId);
    const gotoCommand = db.commands.all().find(x => x.name === 'goto');
    expect(gotoCommand).toBeTruthy();
    expect(gotoCommand.callsite).toContain('tmp--testdatastore');
    expect(gotoCommand.callsite).toContain('@0.0.1');
}, 45e3);
test('it should throw an error if the default export is not a datastore', async () => {
    const packager2 = new datastore_packager_1.default(require.resolve('./_testDatastore2.js'));
    await expect(packager2.build()).rejects.toThrow('Datastore must specify a coreVersion');
}, 45e3);
//# sourceMappingURL=basic.test.js.map