"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
// eslint-disable-next-line import/no-extraneous-dependencies
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const hero_1 = require("@ulixee/hero");
const net_1 = require("@ulixee/net");
const Fs = require("fs");
const fs_1 = require("fs");
const Path = require("path");
datastore_testing_1.Helpers.blockGlobalConfigWrites();
const datastoresDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'ReplayRegistry.test');
let server;
beforeAll(async () => {
    server = await datastore_testing_1.Helpers.runKoaServer();
});
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
test('should get hero sessions from the registry', async () => {
    const storageNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, '1'),
            queryHeroSessionsDir: Path.join(datastoresDir, '1', 'query'),
            replayRegistryHost: 'self',
        },
        heroConfiguration: {
            dataDir: Path.join(datastoresDir, '1', 'hero'),
        },
        hostedServicesServerOptions: { port: 0 },
    });
    const heroPluginCore = getPlugin(storageNode);
    const storageStoreSpy = jest.spyOn(heroPluginCore.replayRegistry.replayStorageRegistry, 'store');
    const storageGetSpy = jest.spyOn(heroPluginCore.replayRegistry.replayStorageRegistry, 'get');
    const storageDeleteSpy = jest.spyOn(heroPluginCore.replayRegistry.replayStorageRegistry, 'delete');
    const childNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, '2'),
            queryHeroSessionsDir: Path.join(datastoresDir, '2', 'query'),
        },
        heroConfiguration: {
            dataDir: Path.join(datastoresDir, '2', 'hero'),
        },
        servicesSetupHost: await storageNode.hostedServicesServer.host,
    });
    const childNode2 = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, '3'),
            queryHeroSessionsDir: Path.join(datastoresDir, '3', 'query'),
        },
        heroConfiguration: {
            dataDir: Path.join(datastoresDir, '3', 'hero'),
        },
        servicesSetupHost: await storageNode.hostedServicesServer.host,
    });
    const packager = new datastore_packager_1.default(`${__dirname}/_heroDatastore.js`);
    await Fs.promises.writeFile(`${__dirname}/_heroDatastore-manifest.json`, JSON.stringify({
        storageEngineHost: await storageNode.host,
    }));
    await packager.build({ createTemporaryVersion: true });
    const client = new DatastoreApiClient_1.default(await childNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    await client.upload(await packager.dbx.tarGzip());
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from getTitle(url => $1)', {
        boundValues: [server.baseUrl],
    })).resolves.toBeTruthy();
    expect(storageStoreSpy).toHaveBeenCalled(); // crawl + extractor
    expect(storageGetSpy).toHaveBeenCalledTimes(0);
    // client 2 should use the replay from the storage node
    const client2 = new DatastoreApiClient_1.default(await childNode2.address);
    datastore_testing_1.Helpers.onClose(() => client2.disconnect(), true);
    await expect(client2.query(packager.manifest.id, packager.manifest.version, 'select * from getTitle(url => $1)', {
        boundValues: [server.baseUrl],
    })).resolves.toBeTruthy();
    expect(storageGetSpy).toHaveBeenCalledTimes(1);
    expect(storageStoreSpy).toHaveBeenCalledTimes(1);
    await getPlugin(childNode2).replayRegistry.flush();
    // should only cache the actual crawl
    await expect(getPlugin(storageNode).replayRegistry.ids()).resolves.toHaveLength(1);
    expect(storageDeleteSpy).toHaveBeenCalledTimes(0);
    const oldSessionId = (await getPlugin(storageNode).replayRegistry.ids())[0];
    // now if we run with max time in cache 0, it should run the crawl again and evict the old one
    await expect(client2.query(packager.manifest.id, packager.manifest.version, 'select * from getTitle(url => $1, maxTimeInCache => 0)', {
        boundValues: [server.baseUrl],
    })).resolves.toBeTruthy();
    expect(storageDeleteSpy).toHaveBeenCalledTimes(1);
    expect(storageStoreSpy).toHaveBeenCalledTimes(2);
    await expect(getPlugin(storageNode).replayRegistry.ids()).resolves.toHaveLength(1);
    const newSessionId = (await getPlugin(storageNode).replayRegistry.ids())[0];
    expect(newSessionId).not.toBe(oldSessionId);
}, 60e3);
test('allows you to delete hero sessions if desktop is enabled', async () => {
    const childNode = await datastore_testing_1.Helpers.createLocalNode({
        disableDesktopCore: false,
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, 'delete'),
            queryHeroSessionsDir: Path.join(datastoresDir, 'delete', 'query'),
        },
        heroConfiguration: {
            dataDir: Path.join(datastoresDir, 'delete', 'hero'),
        },
    });
    const bridge = new net_1.TransportBridge();
    const connectionToCore = new hero_1.ConnectionToHeroCore(bridge.transportToCore);
    childNode.heroCore.addConnection(bridge.transportToClient);
    const hero = new hero_1.default({
        connectionToCore,
        sessionPersistence: false,
    });
    const meta = await hero.meta;
    datastore_testing_1.Helpers.needsClosing.push(hero);
    expect(await childNode.heroCore.sessionRegistry.ids()).toHaveLength(1);
    const session = await childNode.heroCore.sessionRegistry.get(meta.sessionId);
    expect(childNode.desktopCore.sessionControllersById.size).toBe(0);
    await hero.goto(server.baseUrl);
    await hero.waitForLoad('AllContentLoaded');
    await hero.close();
    await expect(childNode.heroCore.sessionRegistry.get(meta.sessionId)).resolves.toBe(undefined);
    expect(await childNode.heroCore.sessionRegistry.ids()).toHaveLength(0);
    expect(childNode.desktopCore.sessionControllersById.size).toBe(0);
    expect((0, fs_1.existsSync)(session.path)).toBe(false);
}, 60e3);
function getPlugin(node) {
    return node.datastoreCore.pluginCoresByName['@ulixee/datastore-plugins-hero'];
}
//# sourceMappingURL=ReplayRegistry.test.js.map