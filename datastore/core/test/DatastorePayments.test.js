"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosts_1 = require("@ulixee/commons/config/hosts");
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const Address_1 = require("@ulixee/crypto/lib/Address");
const Identity_1 = require("@ulixee/crypto/lib/Identity");
const datastore_packager_1 = require("@ulixee/datastore-packager");
const cloneDatastore_1 = require("@ulixee/datastore/cli/cloneDatastore");
const CreditsStore_1 = require("@ulixee/datastore/lib/CreditsStore");
const DatastoreApiClient_1 = require("@ulixee/datastore/lib/DatastoreApiClient");
const sidechain_1 = require("@ulixee/sidechain");
const ArgonUtils_1 = require("@ulixee/sidechain/lib/ArgonUtils");
const MicronoteBatchFunding_1 = require("@ulixee/sidechain/lib/MicronoteBatchFunding");
const Fs = require("fs");
const Path = require("path");
const moment = require("moment");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'DatastorePayments.test');
let cloudNode;
let client;
const sidechainIdentity = Identity_1.default.createSync();
const batchIdentity = Identity_1.default.createSync();
const clientIdentity = Identity_1.default.createSync();
const adminIdentity = Identity_1.default.createSync();
const batchSlug = 'ABCDEF12345125';
const address = Address_1.default.createFromSigningIdentities([clientIdentity]);
const apiCalls = jest.fn();
CreditsStore_1.default.storePath = Path.join(storageDir, `credits.json`);
jest.spyOn(CreditsStore_1.default, 'writeToDisk').mockImplementation(() => null);
jest.spyOn(hosts_1.default.global, 'save').mockImplementation(() => null);
const mock = {
    sidechainClient: {
        sendRequest: jest.spyOn(sidechain_1.default.prototype, 'sendRequest'),
    },
    MicronoteBatchFunding: {
        verifyBatch: jest.spyOn(MicronoteBatchFunding_1.default.prototype, 'verifyBatch'),
        fundBatch: jest.spyOn(MicronoteBatchFunding_1.default.prototype, 'fundBatch'),
    },
};
beforeAll(async () => {
    if (Fs.existsSync(`${__dirname}/datastores/output-manifest.json`)) {
        Fs.unlinkSync(`${__dirname}/datastores/output-manifest.json`);
    }
    if (Fs.existsSync(`${__dirname}/datastores/output.dbx`)) {
        Fs.rmSync(`${__dirname}/datastores/output.dbx`, { recursive: true });
    }
    mock.MicronoteBatchFunding.fundBatch.mockImplementation(async function (batch, centagons) {
        return this.recordBatchFund('1'.padEnd(30, '0'), ArgonUtils_1.default.centagonsToMicrogons(centagons), batch);
    });
    mock.sidechainClient.sendRequest.mockImplementation(mockSidechainServer);
    cloudNode = await datastore_testing_1.Helpers.createLocalNode({
        datastoreConfiguration: {
            datastoresDir: storageDir,
            datastoresTmpDir: Path.join(storageDir, 'tmp'),
            identityWithSidechain: Identity_1.default.createSync(),
            defaultSidechainHost: 'http://localhost:1337',
            defaultSidechainRootIdentity: sidechainIdentity.bech32,
            approvedSidechains: [
                { rootIdentity: sidechainIdentity.bech32, url: 'http://localhost:1337' },
            ],
        },
    }, true);
    client = new DatastoreApiClient_1.default(await cloudNode.address, { consoleLogErrors: true });
    datastore_testing_1.Helpers.onClose(() => client.disconnect(), true);
});
beforeEach(() => {
    mock.MicronoteBatchFunding.verifyBatch.mockClear();
    mock.MicronoteBatchFunding.fundBatch.mockClear();
    mock.sidechainClient.sendRequest.mockClear();
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('should be able to run a datastore function with payments', async () => {
    apiCalls.mockClear();
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/output.js`);
    await Fs.writeFileSync(`${__dirname}/datastores/output-manifest.json`, JSON.stringify({
        version: '0.0.1',
        paymentAddress: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('payme123'), 'ar'),
        extractorsByName: {
            putout: {
                prices: [
                    {
                        perQuery: 1250,
                    },
                ],
            },
        },
    }));
    const dbx = await packager.build();
    const manifest = packager.manifest;
    expect(manifest.extractorsByName.putout.prices[0].perQuery).toBe(1250);
    await client.upload(await dbx.tarGzip());
    await expect(client.query(manifest.id, manifest.version, 'SELECT * FROM putout()')).rejects.toThrow('requires payment');
    await expect(client.stream(manifest.id, manifest.version, 'putout', {})).rejects.toThrow('requires payment');
    const sidechainClient = new sidechain_1.default('http://localhost:1337', {
        identity: clientIdentity,
        address,
    });
    const settings = await sidechainClient.getSettings(false);
    expect(settings.settlementFeeMicrogons).toBe(5);
    apiCalls.mockClear();
    const meta = await client.getExtractorPricing(manifest.id, manifest.version, 'putout');
    const payment = await sidechainClient.createMicroPayment({
        microgons: meta.minimumPrice,
        ...meta,
    });
    expect(payment.micronote.microgons).toBeGreaterThanOrEqual(1255);
    expect(apiCalls.mock.calls.map(x => x[0].command)).toEqual([
        // 'Sidechain.settings', should be cached
        'Sidechain.openBatches',
        'MicronoteBatch.findFund',
        'Micronote.create',
    ]);
    apiCalls.mockClear();
    await expect(client.query(manifest.id, manifest.version, 'SELECT success FROM putout()', {
        payment,
    })).resolves.toEqual({
        outputs: [{ success: true }],
        metadata: {
            microgons: 1255,
            bytes: expect.any(Number),
            milliseconds: expect.any(Number),
        },
        latestVersion: expect.any(String),
    });
    expect(apiCalls.mock.calls.map(x => x[0].command)).toEqual([
        // from DatastoreCore
        'Sidechain.settings',
        'Micronote.hold',
        'Micronote.settle',
    ]);
    // @ts-ignore
    const statsTracker = cloudNode.datastoreCore.statsTracker;
    const entry = await statsTracker.getForDatastoreVersion(manifest);
    expect(entry.stats.queries).toBe(3);
    expect(entry.stats.errors).toBe(2);
    expect(entry.stats.maxPricePerQuery).toBe(1255);
    expect(entry.statsByEntityName.putout.stats.queries).toBe(1);
    expect(entry.statsByEntityName.putout.stats.maxPricePerQuery).toBe(1250);
    const streamed = client.stream(manifest.id, manifest.version, 'putout', {}, { payment });
    await expect(streamed.resultMetadata).resolves.toEqual({
        metadata: {
            microgons: 1255,
            bytes: expect.any(Number),
            milliseconds: expect.any(Number),
        },
        latestVersion: expect.any(String),
    });
});
test('should be able run a Datastore with Credits', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/output.js`);
    await Fs.writeFileSync(`${__dirname}/datastores/output-manifest.json`, JSON.stringify({
        paymentAddress: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('payme123'), 'ar'),
        extractorsByName: {
            putout: {
                prices: [{ perQuery: 1000 }],
            },
        },
        adminIdentities: [adminIdentity.bech32],
        version: '0.0.2',
    }));
    const dbx = await packager.build();
    const manifest = packager.manifest;
    await client.upload(await dbx.tarGzip(), { identity: adminIdentity });
    await expect(client.query(manifest.id, manifest.version, 'SELECT * FROM putout()', {})).rejects.toThrow('requires payment');
    const credits = await client.createCredits(manifest.id, manifest.version, 1001, adminIdentity);
    expect(credits).toEqual({
        id: expect.any(String),
        remainingCredits: 1001,
        secret: expect.any(String),
    });
    await expect(client.query(manifest.id, manifest.version, 'SELECT * FROM putout()', {
        payment: { credits },
    })).resolves.toEqual({
        outputs: [{ success: true }],
        metadata: {
            microgons: 1000,
            bytes: expect.any(Number),
            milliseconds: expect.any(Number),
        },
        latestVersion: manifest.version,
    });
    await expect(client.getCreditsBalance(manifest.id, manifest.version, credits.id)).resolves.toEqual({
        balance: 1,
        issuedCredits: 1001,
    });
    await expect(client.query(manifest.id, manifest.version, 'SELECT * FROM putout()', {
        payment: { credits },
    })).rejects.toThrow('insufficient balance');
});
test('should remove an empty Credits from the local cache', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/output.js`);
    await Fs.writeFileSync(`${__dirname}/datastores/output-manifest.json`, JSON.stringify({
        extractorsByName: {
            putout: {
                prices: [{ perQuery: 1250 }],
            },
        },
        paymentAddress: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('payme123'), 'ar'),
        adminIdentities: [adminIdentity.bech32],
        version: '0.0.3',
    }));
    const dbx = await packager.build();
    const manifest = packager.manifest;
    await client.upload(await dbx.tarGzip(), { identity: adminIdentity });
    const credits = await client.createCredits(manifest.id, manifest.version, 1250, adminIdentity);
    await CreditsStore_1.default.store(manifest.id, manifest.version, client.connectionToCore.transport.host, credits);
    await expect(CreditsStore_1.default.getPayment(manifest.id, manifest.version, 1250)).resolves.toBeTruthy();
    await expect(CreditsStore_1.default.getPayment(manifest.id, manifest.version, 1)).resolves.toBeUndefined();
});
test('should be able to embed Credits in a Datastore', async () => {
    const packager = new datastore_packager_1.default(`${__dirname}/datastores/output.js`);
    await Fs.writeFileSync(`${__dirname}/datastores/output-manifest.json`, JSON.stringify({
        paymentAddress: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('payme123'), 'ar'),
        extractorsByName: {
            putout: {
                prices: [{ perQuery: 1000 }],
            },
        },
        adminIdentities: [adminIdentity.bech32],
        version: '0.0.4',
    }));
    const dbx = await packager.build();
    const manifest = packager.manifest;
    await client.upload(await dbx.tarGzip(), { identity: adminIdentity });
    const credits = await client.createCredits(manifest.id, manifest.version, 2001, adminIdentity);
    await expect(client.stream(manifest.id, manifest.version, 'putout', {}, { payment: { credits } })).resolves.toEqual([{ success: true }]);
    await expect(client.getCreditsBalance(manifest.id, manifest.version, credits.id)).resolves.toEqual({
        balance: 1001,
        issuedCredits: 2001,
    });
    await (0, cloneDatastore_1.default)(`ulx://${await cloudNode.address}/${manifest.id}@v${manifest.version}`, `${__dirname}/datastores/clone-output`, { embedCredits: credits });
    await Fs.writeFileSync(`${__dirname}/datastores/clone-output/datastore-manifest.json`, JSON.stringify({
        paymentAddress: (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('payme123'), 'ar'),
        extractorsByName: {
            putout: {
                prices: [{ perQuery: 1000 }],
            },
        },
        adminIdentities: [adminIdentity.bech32],
    }));
    {
        const packager2 = new datastore_packager_1.default(`${__dirname}/datastores/clone-output/datastore.ts`);
        const dbx2 = await packager2.build({ createTemporaryVersion: true });
        const manifest2 = packager2.manifest;
        await client.upload(await dbx2.tarGzip(), { identity: adminIdentity });
        const credits2 = await client.createCredits(manifest2.id, manifest2.version, 1002, adminIdentity);
        await expect(client.stream(manifest2.id, manifest2.version, 'putout', {}, { payment: { credits: credits2 } })).resolves.toEqual([{ success: true }]);
        await expect(client.getCreditsBalance(manifest.id, manifest.version, credits.id)).resolves.toEqual({
            balance: 1,
            issuedCredits: 2001,
        });
        await expect(client.getCreditsBalance(manifest2.id, manifest2.version, credits2.id)).resolves.toEqual({
            balance: 2,
            issuedCredits: 1002,
        });
    }
    // @ts-expect-error
    expect(cloudNode.datastoreCore.vm.apiClientCache.apiClientCacheByUrl).toEqual({
        [`ulx://${await cloudNode.address}`]: expect.any(DatastoreApiClient_1.default),
    });
}, 60e3);
async function mockSidechainServer(message) {
    const { command, args } = message;
    apiCalls(message);
    if (command === 'Sidechain.settings') {
        return {
            // built to handle more than one key if we need to rotate one out
            rootIdentities: [sidechainIdentity.bech32],
            identityProofSignatures: [
                sidechainIdentity.sign((0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)(command, args?.identity))),
            ],
            latestBlockSettings: {
                height: 0,
                sidechains: [{ rootIdentity: sidechainIdentity.bech32, url: 'http://localhost:1337' }],
            },
            batchDurationMinutes: 60 * 60e3 * 8,
            settlementFeeMicrogons: 5,
            version: '1.0.0',
        };
    }
    if (command === 'Micronote.hold') {
        return {
            accepted: true,
            holdId: '1234'.padEnd(30, '0'),
        };
    }
    if (command === 'Micronote.settle') {
        const payments = Object.values(args.tokenAllocation).reduce((x, t) => x + t, 0);
        return { finalCost: payments + 5 };
    }
    if (command === 'MicronoteBatch.findFund') {
        return {};
    }
    if (command === 'Sidechain.openBatches') {
        return {
            micronote: [
                {
                    batchSlug,
                    stopNewNotesTime: moment().add(1, 'hour').toDate(),
                    micronoteBatchIdentity: batchIdentity.bech32,
                    sidechainIdentity: sidechainIdentity.bech32,
                    sidechainValidationSignature: sidechainIdentity.sign((0, hashUtils_1.sha256)(batchIdentity.bech32)),
                },
            ],
        };
    }
    if (command === 'Micronote.create') {
        const id = (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)('micronoteId'), 'mcr');
        const mcrBatchSlug = args.batchSlug;
        return {
            batchSlug: mcrBatchSlug,
            id,
            blockHeight: 0,
            guaranteeBlockHeight: 0,
            fundsId: '1'.padEnd(30, '0'),
            fundMicrogonsRemaining: 5000,
            micronoteSignature: batchIdentity.sign((0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)(id, args.microgons))),
        };
    }
    if (command === 'MicronoteBatch.activeFunds') {
        return [];
    }
    throw new Error(`unknown request ${command}`);
}
//# sourceMappingURL=DatastorePayments.test.js.map