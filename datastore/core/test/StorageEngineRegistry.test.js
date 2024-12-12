"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const SqliteStorageEngine_1 = require("@ulixee/datastore/storage-engines/SqliteStorageEngine");
const Fs = require("fs");
const Path = require("path");
datastore_testing_1.Helpers.blockGlobalConfigWrites();
const datastoresDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'StorageEngineRegistry.test');
beforeEach(async () => {
    await Fs.promises.rm(datastoresDir, { recursive: true }).catch(() => null);
    await Fs.promises.rm(`${__dirname}/datastores/remoteStorage-manifest.json`).catch(() => null);
    await Fs.promises
        .rm(`${__dirname}/datastores/migrator.dbx`, { recursive: true })
        .catch(() => null);
    await Fs.promises
        .rm(`${__dirname}/datastores/remoteStorage.dbx`, { recursive: true })
        .catch(() => null);
});
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
test('should run migrations on start', async () => {
    const cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: { datastoresDir },
    });
    const client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    const path = Path.join(__dirname, 'datastores', 'migrator.js');
    await Fs.promises.writeFile(path, `const { default: Datastore, Table } = require("@ulixee/datastore");
const { boolean, string } = require("@ulixee/schema");

module.exports = new Datastore({
  id: 'storage',
  version: '0.0.1',
  tables: {
   migrator: new Table({
    schema: {
      title: string(),
      success: boolean(),
    },
   }),
  },
  async onCreated() {
    await this.tables.migrator.insertInternal(
      { title: 'Hello', success: true },
      { title: 'World', success: false },
    );
  },
});
`, 'utf8');
    const packager = new datastore_packager_1.default(path);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    // @ts-expect-error
    const datastoresDb = cloudNode.datastoreCore.datastoreRegistry.diskStore.datastoresDb;
    await expect(client.stream('storage', '0.0.1', 'migrator', {
        success: false,
    })).resolves.toEqual([{ title: 'World', success: false }]);
    await Fs.promises.writeFile(path, `const { default: Datastore, Table } = require("@ulixee/datastore");
const { boolean, string } = require("@ulixee/schema");

module.exports = new Datastore({
  id: 'storage',
  version: '0.0.2',
  tables: {
   migrator: new Table({
    schema: {
      title: string(),
      newColumn: string({ enum: ['not', 'ought'] }),
      success: boolean(),
    },
   }),
  },
  async onVersionMigrated(prev) {
    const records = await prev.tables.migrator.fetchInternal();
    await this.tables.migrator.insertInternal(
      ...records.map(x => ({
        ...x,
        newColumn: x.success ? 'not' : 'ought',
      })),
    );
  },
});
`, 'utf8');
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    const datastores2 = datastoresDb.versions.all();
    expect(datastores2).toHaveLength(2);
    await expect(client.stream('storage', '0.0.2', 'migrator', {
        success: false,
    })).resolves.toEqual([{ title: 'World', newColumn: 'ought', success: false }]);
}, 45e3);
test('should require uploaded datastores to have a storage engine endpoint if configured', async () => {
    // force cloud node to host
    const storageNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: { storageEngineHost: 'localhost:1811/notreal', datastoresDir },
    });
    datastore_testing_1.Helpers.needsClosing.push(storageNode);
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/remoteStorage.js`);
    await packager.build();
    expect(packager.manifest.storageEngineHost).not.toBeTruthy();
    const newClient = new DatastoreApiClient_1.default(await storageNode.address);
    datastore_testing_1.Helpers.onClose(() => newClient.disconnect());
    await expect(newClient.upload(await packager.dbx.tarGzip())).rejects.toThrow('storage engine host');
});
test('should be able to use a remote storage engine endpoint', async () => {
    // force cloud node to host
    const storageHostNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: { datastoresDir: Path.join(datastoresDir, 'storage-node') },
    });
    const clusterNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, 'cluster-node'),
            storageEngineHost: await storageHostNode.host,
        },
    });
    const storageNodeRegistrySpy = jest.spyOn(storageHostNode.datastoreCore.storageEngineRegistry, 'get');
    const storageNodeInstallStorageSpy = jest.spyOn(storageHostNode.datastoreCore.storageEngineRegistry, 'create');
    const clusterNodeRegistrySpy = jest.spyOn(clusterNode.datastoreCore.storageEngineRegistry, 'get');
    await Fs.promises.writeFile(`${__dirname}/datastores/remoteStorage-manifest.json`, JSON.stringify({
        storageEngineHost: await storageHostNode.host,
    }));
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/remoteStorage.js`);
    await packager.build();
    const client = new DatastoreApiClient_1.default(await clusterNode.host);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    await expect(client.upload(await packager.dbx.tarGzip())).resolves.toBeTruthy();
    expect(storageNodeRegistrySpy).toHaveBeenCalledTimes(1);
    expect(storageNodeRegistrySpy.mock.results[0].value).toBeInstanceOf(SqliteStorageEngine_1.default);
    expect(clusterNodeRegistrySpy).toHaveBeenCalledTimes(1);
    expect(storageNodeInstallStorageSpy).toHaveBeenCalled();
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from intro where visible=true', {})).resolves.toEqual({
        outputs: [{ title: 'Hello', visible: true }],
        metadata: expect.any(Object),
        latestVersion: expect.any(String),
        queryId: expect.any(String),
    });
    expect(storageNodeRegistrySpy).toHaveBeenCalledTimes(2);
    expect(clusterNodeRegistrySpy).toHaveBeenCalledTimes(2);
}, 45e3);
test('should not create a websocket connection to localhost if on same machine', async () => {
    const node = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: { datastoresDir },
    });
    const nodeRegistrySpy = jest.spyOn(node.datastoreCore.storageEngineRegistry, 'get');
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/remoteStorage.js`);
    await packager.build();
    await Fs.promises.writeFile(`${__dirname}/datastores/remoteStorage-manifest.json`, JSON.stringify({
        storageEngineHost: await node.host,
    }));
    const client = new DatastoreApiClient_1.default(await node.host);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    await expect(client.upload(await packager.dbx.tarGzip())).resolves.toBeTruthy();
    expect(nodeRegistrySpy).toHaveBeenCalledTimes(1);
    expect(nodeRegistrySpy.mock.results[0].value).toBeInstanceOf(SqliteStorageEngine_1.default);
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from intro where visible=true', {})).resolves.toEqual({
        outputs: [{ title: 'Hello', visible: true }],
        metadata: expect.any(Object),
        latestVersion: expect.any(String),
        queryId: expect.any(String),
    });
    expect(nodeRegistrySpy).toHaveBeenCalledTimes(2);
    expect(nodeRegistrySpy.mock.results[1].value).toBeInstanceOf(SqliteStorageEngine_1.default);
});
test('should not install storage engine when downloading from cluster', async () => {
    const datastoreRegistryHost = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, 'registry-node'),
            storageEngineHost: 'localhost:1819',
        },
        hostedServicesServerOptions: { port: 0 },
    });
    // force cloud node to host
    const storageHostNode = await datastore_testing_1.Helpers.createLocalNode({
        port: 1819,
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, 'storage-node'),
            datastoreRegistryHost: await datastoreRegistryHost.hostedServicesServer.host,
            storageEngineHost: 'self',
        },
    });
    const clusterNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(datastoresDir, 'cluster-node'),
            storageEngineHost: await storageHostNode.host,
            datastoreRegistryHost: await datastoreRegistryHost.hostedServicesServer.host,
        },
    });
    const storageNodeRegistrySpy = jest.spyOn(storageHostNode.datastoreCore.storageEngineRegistry, 'get');
    const storageNodeInstallStorageSpy = jest.spyOn(storageHostNode.datastoreCore.storageEngineRegistry, 'create');
    const clusterNodeRegistrySpy = jest.spyOn(clusterNode.datastoreCore.storageEngineRegistry, 'get');
    await Fs.promises.writeFile(`${__dirname}/datastores/remoteStorage-manifest.json`, JSON.stringify({
        storageEngineHost: await storageHostNode.host,
    }));
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/remoteStorage.js`);
    await packager.build();
    const datastoreRegistryHostClient = new DatastoreApiClient_1.default(await datastoreRegistryHost.host);
    datastore_testing_1.Helpers.onClose(() => datastoreRegistryHostClient.disconnect());
    await expect(datastoreRegistryHostClient.upload(await packager.dbx.tarGzip())).resolves.toBeTruthy();
    expect(storageNodeRegistrySpy).toHaveBeenCalledTimes(1);
    expect(storageNodeRegistrySpy.mock.results[0].value).toBeInstanceOf(SqliteStorageEngine_1.default);
    expect(storageNodeInstallStorageSpy).toHaveBeenCalledTimes(1);
    expect(clusterNodeRegistrySpy).toHaveBeenCalledTimes(0);
    const client = new DatastoreApiClient_1.default(await clusterNode.host);
    datastore_testing_1.Helpers.onClose(() => client.disconnect());
    await expect(client.query(packager.manifest.id, packager.manifest.version, 'select * from intro where visible=true', {})).resolves.toEqual({
        outputs: [{ title: 'Hello', visible: true }],
        metadata: expect.any(Object),
        latestVersion: expect.any(String),
        queryId: expect.any(String),
    });
    expect(storageNodeRegistrySpy).toHaveBeenCalledTimes(2);
    expect(clusterNodeRegistrySpy).toHaveBeenCalledTimes(1);
    expect(storageNodeInstallStorageSpy).toHaveBeenCalledTimes(1);
});
//# sourceMappingURL=StorageEngineRegistry.test.js.map