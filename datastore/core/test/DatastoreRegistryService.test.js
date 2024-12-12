"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const Fs = require("fs");
const Path = require("path");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastoreRegistryService.test');
let plainNode;
let nodeWithServices;
let client;
let packager;
beforeAll(async () => {
    nodeWithServices = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(storageDir, 'with-services'),
        },
        hostedServicesServerOptions: { port: 0 },
    }, true);
    plainNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: Path.join(storageDir, 'plain'),
        },
        servicesSetupHost: await nodeWithServices.hostedServicesServer.host,
    }, true);
    client = new DatastoreApiClient_1.default(await plainNode.address);
    Fs.writeFileSync(`${__dirname}/datastores/datastoreRegistryService1-manifest.json`, JSON.stringify({ storageEngineHost: await nodeWithServices.host }));
    await Fs.promises
        .rm(`${__dirname}/datastores/datastoreRegistryService1.dbx`, { recursive: true })
        .catch(() => null);
    packager = new datastore_packager_1.default(`${__dirname}/datastores/datastoreRegistryService1.js`);
    await packager.build();
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
}, 60e3);
afterAll(datastore_testing_1.Helpers.afterAll);
afterEach(datastore_testing_1.Helpers.afterEach);
test('should proxy datastore uploads to the registry owner', async () => {
    expect(plainNode.datastoreCore.options.datastoreRegistryHost).toContain(await nodeWithServices.hostedServicesServer.host);
    const registryHomeSave = jest.spyOn(nodeWithServices.datastoreCore.datastoreRegistry, 'save');
    const dbxFile = await packager.dbx.tarGzip();
    await expect(client.upload(dbxFile)).resolves.toBeTruthy();
    expect(registryHomeSave).toHaveBeenCalledTimes(1);
});
test('should look for datastores in the hosted service', async () => {
    await packager.dbx.upload(await nodeWithServices.host).catch(() => null);
    const clusterNodeGet = jest.spyOn(nodeWithServices.datastoreCore.datastoreRegistry, 'get');
    const plainNodeCheckCluster = jest.spyOn(plainNode.datastoreCore.datastoreRegistry.clusterStore, 'get');
    const plainNodeDownloadFromCluster = jest.spyOn(plainNode.datastoreCore.datastoreRegistry.clusterStore, 'downloadDbx');
    await expect(client.getMeta(packager.manifest.id, packager.manifest.version)).resolves.toBeTruthy();
    expect(clusterNodeGet).toHaveBeenCalled();
    expect(plainNodeCheckCluster).toHaveBeenCalledTimes(1);
    expect(plainNodeDownloadFromCluster).toHaveBeenCalledTimes(1);
});
//# sourceMappingURL=DatastoreRegistryService.test.js.map