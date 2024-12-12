"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const mainchain_1 = require("@argonprotocol/mainchain");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const ArgonReserver_1 = require("@ulixee/datastore/payments/ArgonReserver");
const CreditReserver_1 = require("@ulixee/datastore/payments/CreditReserver");
const Fs = require("fs");
const Path = require("path");
const _MockArgonPaymentProcessor_1 = require("./_MockArgonPaymentProcessor");
const _MockPaymentService_1 = require("./_MockPaymentService");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'PassthroughExtractors.test');
let cloudNode;
let client;
const keyring = new mainchain_1.Keyring({ ss58Format: 18 });
datastore_testing_1.Helpers.blockGlobalConfigWrites();
const argonPaymentProcessorMock = new _MockArgonPaymentProcessor_1.default();
let argonPaymentProcessor;
const mainchainIdentity = {
    chain: localchain_1.Chain.Devnet,
    genesisHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
};
let remoteVersion;
let remoteDatastoreId;
beforeAll(async () => {
    for (const file of [
        'passthroughExtractor',
        'passthroughExtractorUpcharge',
        'passthroughExtractorNoOnresponse',
        'hop2',
    ]) {
        if (Fs.existsSync(`${__dirname}/datastores/${file}.js`)) {
            Fs.unlinkSync(`${__dirname}/datastores/${file}.js`);
        }
        if (Fs.existsSync(`${__dirname}/datastores/${file}.dbx`)) {
            await Fs.promises.rm(`${__dirname}/datastores/${file}.dbx`, { recursive: true });
        }
    }
    if (Fs.existsSync(`${__dirname}/datastores/remoteExtractor.dbx`)) {
        await Fs.promises.rm(`${__dirname}/datastores/remoteExtractor.dbx`, { recursive: true });
    }
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
        },
    }, true, {
        address: keyring.createFromUri('upstream').address,
        notaryId: 1,
        ...mainchainIdentity,
    });
    argonPaymentProcessor = cloudNode.datastoreCore.argonPaymentProcessor;
    client = new DatastoreApiClient_1.default(await cloudNode.address);
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/remoteExtractor.js`);
    await packager.build();
    await client.upload(await packager.dbx.tarGzip());
    remoteVersion = packager.manifest.version;
    remoteDatastoreId = packager.manifest.id;
});
let storageCounter = 0;
beforeEach(() => {
    storageCounter += 1;
    ArgonReserver_1.default.baseStorePath = Path.join(storageDir, `payments-${storageCounter}`);
    CreditReserver_1.default.defaultBasePath = Path.join(storageDir, `credits-${storageCounter}`);
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(async () => {
    await datastore_testing_1.Helpers.afterAll();
});
test('should be able to have a passthrough extractor', async () => {
    await expect(client.stream(remoteDatastoreId, remoteVersion, 'remote', { test: '123d' })).resolves.toEqual([{ iAmRemote: true, echo: '123d' }]);
    Fs.writeFileSync(`${__dirname}/datastores/passthroughExtractor.js`, `const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  remoteDatastores: {
    source: 'ulx://${await cloudNode.address}/${remoteDatastoreId}@v${remoteVersion}',
  },
  extractors: {
    pass: new Datastore.PassthroughExtractor({
      remoteExtractor: 'source.remote',
      schema: {
        input: {
          test: string(),
        },
        output: {
          iAmRemote: boolean(),
          echo: string(),
          addOn: string(),
        },
      },
      async onResponse({ stream, Output }) {
        for await (const output of stream) {
          Output.emit({ ...output, addOn: 'phew' })
        }
      },
    }),
  },
});`);
    const passthrough = new datastore_packager_1.default(`${__dirname}/datastores/passthroughExtractor.js`);
    await passthrough.build({ createTemporaryVersion: true });
    await client.upload(await passthrough.dbx.tarGzip());
    await expect(client.stream(passthrough.manifest.id, passthrough.manifest.version, 'pass', {
        test: '123d',
    })).resolves.toEqual([{ iAmRemote: true, echo: '123d', addOn: 'phew' }]);
});
test('should re-emit output automatically if no onResponse is provided', async () => {
    await expect(client.stream(remoteDatastoreId, remoteVersion, 'remote', { test: '123d' })).resolves.toEqual([{ iAmRemote: true, echo: '123d' }]);
    Fs.writeFileSync(`${__dirname}/datastores/passthroughExtractorNoOnresponse.js`, `const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  remoteDatastores: {
    source: 'ulx://${await cloudNode.address}/${remoteDatastoreId}@v${remoteVersion}',
  },
  extractors: {
    pass: new Datastore.PassthroughExtractor({
      remoteExtractor: 'source.remote',
      schema: {
        input: {
          test: string(),
        },
        output: {
          iAmRemote: boolean(),
          echo: string(),
        },
      }
    }),
  },
});`);
    const passthrough = new datastore_packager_1.default(`${__dirname}/datastores/passthroughExtractorNoOnresponse.js`);
    await passthrough.build({ createTemporaryVersion: true });
    await client.upload(await passthrough.dbx.tarGzip());
    await expect(client.stream(passthrough.manifest.id, passthrough.manifest.version, 'pass', {
        test: '123d',
    })).resolves.toEqual([{ iAmRemote: true, echo: '123d' }]);
});
test('should be able to add upcharge to a extractor', async () => {
    Fs.writeFileSync(`${__dirname}/datastores/passthroughExtractorUpcharge.js`, `
const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  remoteDatastores: {
    source: 'ulx://${await cloudNode.address}/${remoteDatastoreId}@v${remoteVersion}',
  },
  extractors: {
    pass: new Datastore.PassthroughExtractor({
      upcharge: 400_000,
      remoteExtractor: 'source.remote',
      async onResponse({ stream, Output }) {
        for await (const output of stream) {
           Output.emit({ ...output, addOn: 'phew '})
        }
      },
    }),
  },
});`);
    const passthrough = new datastore_packager_1.default(`${__dirname}/datastores/passthroughExtractorUpcharge.js`);
    await passthrough.build({ createTemporaryVersion: true });
    await client.upload(await passthrough.dbx.tarGzip());
    const meta = await client.getMeta(passthrough.manifest.id, passthrough.manifest.version);
    expect(meta.extractorsByName.pass.netBasePrice).toBe(400000n);
    expect(meta.extractorsByName.pass.priceBreakdown).toEqual([
        { basePrice: 400000n },
        { basePrice: 0n, remoteMeta: expect.any(Object) },
    ]);
});
test('should be able to add charges from multiple extractors', async () => {
    const address1 = keyring.createFromUri('extractor1');
    let sourceCloudAddress;
    let hop1CloudAddress;
    const sourceDatastoreId = 'source-store';
    const hop1DatastoreId = 'hop1-store';
    const channelHolds = [];
    const clientAddress = keyring.createFromUri('client');
    const paymentService = new _MockPaymentService_1.default(clientAddress, client, null, 'client');
    const paymentServices = [paymentService];
    let hop1Cloud;
    let sourceCloudNode;
    argonPaymentProcessorMock.mock((id, balanceChange) => {
        const channelHoldId = paymentServices
            .map(x => x.paymentsByDatastoreId[id])
            .find(Boolean).channelHoldId;
        const channelHold = paymentServices.map(x => x.channelHoldsById[channelHoldId]).find(Boolean);
        channelHolds.push({
            datastoreId: id,
            channelHoldId,
            holdAmount: channelHold.channelHoldAmount,
        });
        return {
            id: channelHoldId,
            expirationTick: channelHold.tick + 100,
            holdAmount: channelHold.channelHoldAmount,
        };
    });
    {
        const sourceCloudDir = Path.join(storageDir, 'sourceCloud');
        Fs.mkdirSync(sourceCloudDir, { recursive: true });
        sourceCloudNode = await datastore_testing_1.Helpers.createLocalNode({
            datastoreConfiguration: {
                datastoresDir: sourceCloudDir,
            },
        }, false, {
            address: address1.address,
            notaryId: 1,
            ...mainchainIdentity,
        });
        sourceCloudAddress = await sourceCloudNode.address;
        Fs.writeFileSync(`${__dirname}/datastores/source.js`, `
const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  id: '${sourceDatastoreId}',
  version: '0.0.1', 
  extractors: {
    source: new Datastore.Extractor({
      basePrice: 6_000,
      run({ input, Output }) {
        const output = new Output();
        output.calls = 1;
        output.lastRun = 'source';
      }
    }),
  },
});`);
        const dbx = new datastore_packager_1.default(`${__dirname}/datastores/source.js`);
        try {
            await dbx.build();
        }
        catch (err) {
            console.log('ERROR Uploading Manifest', err);
            throw err;
        }
        datastore_testing_1.Helpers.onClose(() => Fs.promises.unlink(`${__dirname}/datastores/source.js`));
        datastore_testing_1.Helpers.onClose(() => Fs.promises.rm(`${__dirname}/datastores/source.dbx`, { recursive: true }));
        const client1 = new DatastoreApiClient_1.default(await sourceCloudNode.address);
        datastore_testing_1.Helpers.onClose(() => client1.disconnect());
        await client1.upload(await dbx.dbx.tarGzip());
        const price = await client1.pricing.getEntityPrice(sourceDatastoreId, '0.0.1', 'source');
        expect(price).toBe(6000n);
    }
    const address2 = keyring.createFromUri('extractor2');
    {
        const cloud2StorageDir = Path.join(storageDir, 'hop1Cloud');
        Fs.mkdirSync(cloud2StorageDir, { recursive: true });
        hop1Cloud = await datastore_testing_1.Helpers.createLocalNode({
            datastoreConfiguration: {
                datastoresDir: cloud2StorageDir,
            },
        }, true, {
            address: keyring.createFromUri('extractor2').address,
            notaryId: 1,
            ...mainchainIdentity,
        });
        hop1CloudAddress = await hop1Cloud.address;
        const corePaymentService = new _MockPaymentService_1.default(address2, new DatastoreApiClient_1.default(sourceCloudAddress), null, 'hop1cloud');
        paymentServices.push(corePaymentService);
        mockUpstreamPayments(corePaymentService, hop1Cloud);
        Fs.writeFileSync(`${__dirname}/datastores/hop1.js`, `
const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  id: '${hop1DatastoreId}',
  version: '0.0.1',
  remoteDatastores: {
    hop0: 'ulx://${sourceCloudAddress}/${sourceDatastoreId}@v0.0.1',
  },
  extractors: {
    source2: new Datastore.PassthroughExtractor({
      upcharge: 11_000,
      remoteExtractor: 'hop0.source',
      async onResponse({ stream, Output }) {
        for await (const output of stream) {
           Output.emit({ ...output, lastRun:'hop1', calls: output.calls +1 })
        }
      },
    }),
  },
});`);
        const dbx = new datastore_packager_1.default(`${__dirname}/datastores/hop1.js`);
        datastore_testing_1.Helpers.onClose(() => Fs.promises.unlink(`${__dirname}/datastores/hop1.js`));
        datastore_testing_1.Helpers.onClose(() => Fs.promises.rm(`${__dirname}/datastores/hop1.dbx`, { recursive: true }));
        await dbx.build();
        const client2 = new DatastoreApiClient_1.default(await hop1Cloud.address);
        datastore_testing_1.Helpers.onClose(() => client2.disconnect());
        await client2.upload(await dbx.dbx.tarGzip());
        const price = await client2.pricing.getEntityPrice(hop1DatastoreId, '0.0.1', 'source2');
        expect(price).toBe(6000n + 11000n);
    }
    Fs.writeFileSync(`${__dirname}/datastores/hop2.js`, `
const Datastore = require('@ulixee/datastore');
const { boolean, string } = require('@ulixee/schema');

export default new Datastore({
  remoteDatastores: {
    hop1: 'ulx://${hop1CloudAddress}/${hop1DatastoreId}@v0.0.1',
  },
  extractors: {
    last: new Datastore.PassthroughExtractor({
      upcharge: 3_000,
      remoteExtractor: 'hop1.source2',
      async onResponse({ stream, Output }) {
        for await (const output of stream) {
           Output.emit({ ...output, lastRun:'hop2', calls: output.calls +1 })
        }
      },
    }),
  },
});`);
    const lastHop = new datastore_packager_1.default(`${__dirname}/datastores/hop2.js`);
    await lastHop.build({ createTemporaryVersion: true });
    await client.upload(await lastHop.dbx.tarGzip());
    const hop2DatastoreId = lastHop.manifest.id;
    const price = await client.pricing.getEntityPrice(lastHop.manifest.id, lastHop.manifest.version, 'last');
    expect(price).toBe(3000n + 6000n + 11000n);
    await expect(client.pricing.getQueryPrice(lastHop.manifest.id, lastHop.manifest.version, 'select * from last()')).resolves.toBe(price);
    const corePaymentService = new _MockPaymentService_1.default(keyring.createFromUri('upstream'), new DatastoreApiClient_1.default(hop1CloudAddress), null, 'hop2cloud');
    paymentServices.push(corePaymentService);
    mockUpstreamPayments(corePaymentService, cloudNode);
    const result = await client.query(lastHop.manifest.id, lastHop.manifest.version, 'select * from last()', {
        paymentService,
    });
    expect(result.outputs[0].calls).toBe(3);
    expect(result.outputs[0].lastRun).toBe('hop2');
    expect(result.metadata.microgons).toBe(price);
    expect(channelHolds).toHaveLength(3);
    // @ts-expect-error
    let dbs = sourceCloudNode.datastoreCore.argonPaymentProcessor.channelHoldDbsByDatastore;
    expect(dbs.size).toBe(1);
    const paymentsByDatastoreId = {};
    for (const service of paymentServices) {
        Object.assign(paymentsByDatastoreId, service.paymentsByDatastoreId);
    }
    expect(dbs.get(sourceDatastoreId).paymentIdByChannelHoldId.size).toBe(1);
    expect(dbs.get(sourceDatastoreId).list()).toEqual([
        expect.objectContaining({
            id: paymentsByDatastoreId[sourceDatastoreId].channelHoldId,
            allocated: 100n * 6000n,
            remaining: 100n * 6000n - 6000n,
        }),
    ]);
    // @ts-expect-error
    dbs = hop1Cloud.datastoreCore.argonPaymentProcessor.channelHoldDbsByDatastore;
    expect(dbs.size).toBe(1);
    expect(dbs.get(hop1DatastoreId).paymentIdByChannelHoldId.size).toBe(1);
    expect(dbs.get(hop1DatastoreId).list()).toEqual([
        expect.objectContaining({
            id: paymentsByDatastoreId[hop1DatastoreId].channelHoldId,
            allocated: 100n * (11000n + 6000n),
            remaining: 100n * (11000n + 6000n) - 6000n - 11000n,
        }),
    ]);
    // @ts-expect-error
    dbs = argonPaymentProcessor.channelHoldDbsByDatastore;
    expect(dbs.size).toBe(1);
    expect(dbs.get(hop2DatastoreId).paymentIdByChannelHoldId.size).toBe(1);
    expect(dbs.get(hop2DatastoreId).list()).toEqual([
        expect.objectContaining({
            id: paymentsByDatastoreId[hop2DatastoreId].channelHoldId,
            allocated: 100n * (11000n + 6000n + 3000n),
            remaining: 100n * (11000n + 6000n + 3000n) - 6000n - 11000n - 3000n,
        }),
    ]);
    let queryLog = sourceCloudNode.datastoreCore.statsTracker.diskStore.queryLogDb.logTable
        .all()
        .filter(x => [sourceDatastoreId, hop1DatastoreId, hop2DatastoreId].includes(x.datastoreId));
    expect(queryLog).toHaveLength(1);
    const queryId = result.queryId;
    expect(queryLog[0].queryId).toBe(`${queryId}.1.1`);
    expect(queryLog[0].datastoreId).toBe(sourceDatastoreId);
    queryLog = hop1Cloud.datastoreCore.statsTracker.diskStore.queryLogDb.logTable
        .all()
        .filter(x => [sourceDatastoreId, hop1DatastoreId, hop2DatastoreId].includes(x.datastoreId));
    expect(queryLog).toHaveLength(1);
    expect(queryLog[0].queryId).toBe(`${queryId}.1`);
    queryLog = cloudNode.datastoreCore.statsTracker.diskStore.queryLogDb.logTable
        .all()
        .filter(x => [sourceDatastoreId, hop1DatastoreId, hop2DatastoreId].includes(x.datastoreId));
    expect(queryLog[0].queryId).toBe(queryId);
});
function mockUpstreamPayments(corePaymentService, registerOnCloudNode) {
    registerOnCloudNode.datastoreCore.upstreamDatastorePaymentService = corePaymentService;
    // @ts-expect-error
    registerOnCloudNode.datastoreCore.vm.remotePaymentService = corePaymentService;
}
//# sourceMappingURL=PassthroughExtractors.test.js.map