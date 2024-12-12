"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainchain_1 = require("@argonprotocol/mainchain");
const client_1 = require("@ulixee/client");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DefaultPaymentService_1 = require("@ulixee/datastore/payments/DefaultPaymentService");
const localchain_1 = require("@argonprotocol/localchain");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const Path = require("node:path");
const util_1 = require("util");
const localchainHelpers_1 = require("../lib/localchainHelpers");
const TestCloudNode_1 = require("../lib/TestCloudNode");
const TestDatabroker_1 = require("../lib/TestDatabroker");
const testHelpers_1 = require("../lib/testHelpers");
const TestMainchain_1 = require("../lib/TestMainchain");
const TestNotary_1 = require("../lib/TestNotary");
const utils_1 = require("../lib/utils");
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'e2e.payments-broker.test');
let argonMainchainUrl;
let brokerAddress;
let broker;
const clientUserPath = Path.join(storageDir, 'DatastoreClient.pem');
const identityPath = Path.join(storageDir, 'DatastoreDev.pem');
let ferdie;
util_1.inspect.defaultOptions.depth = 10;
(0, testHelpers_1.describeIntegration)('Payments with Broker E2E', () => {
    beforeAll(async () => {
        const mainchain = new TestMainchain_1.default();
        argonMainchainUrl = await mainchain.launch(1);
        const notary = new TestNotary_1.default();
        await notary.start(argonMainchainUrl);
        ferdie = new mainchain_1.Keyring({ type: 'sr25519' }).createFromUri('//Ferdie');
        const sudo = new mainchain_1.Keyring({ type: 'sr25519' }).createFromUri('//Alice');
        const mainchainClient = await (0, mainchain_1.getClient)(argonMainchainUrl);
        await (0, TestMainchain_1.activateNotary)(sudo, mainchainClient, notary);
        await mainchainClient.disconnect();
        (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity create --filename="${identityPath}"`);
        (0, utils_1.execAndLog)(`npx @argonprotocol/localchain accounts create --name=brokerchain --suri="//Bob" --scheme=sr25519 --base-dir="${storageDir}"`);
        broker = new TestDatabroker_1.default();
        brokerAddress = await broker.start({
            ULX_DATABROKER_DIR: storageDir,
            ARGON_MAINCHAIN_URL: argonMainchainUrl,
            ARGON_LOCALCHAIN_PATH: Path.join(storageDir, 'brokerchain.db'),
        });
        console.log('booted up', brokerAddress, broker.adminAddress);
    }, 60e3);
    test('it can use a databroker for a domain datastore', async () => {
        const brokerchain = await localchain_1.Localchain.load({
            path: Path.join(storageDir, 'brokerchain.db'),
            mainchainUrl: argonMainchainUrl,
        });
        datastore_testing_1.Helpers.onClose(() => brokerchain.close());
        (0, utils_1.execAndLog)(`npx @argonprotocol/localchain accounts create --name=ferdiechain --suri="//Ferdie" --scheme=sr25519 --base-dir="${storageDir}"`);
        const ferdiechain = await localchain_1.Localchain.load({
            mainchainUrl: argonMainchainUrl,
            path: Path.join(storageDir, 'ferdiechain.db'),
        });
        datastore_testing_1.Helpers.onClose(() => ferdiechain.close());
        const ferdieVotesAddress = ferdie.derive('//votes').address;
        await Promise.all([
            ferdiechain.mainchainTransfers.sendToLocalchain(1000000n, 1),
            brokerchain.mainchainTransfers.sendToLocalchain(5000000n, 1),
        ]);
        await Promise.all([
            (0, localchainHelpers_1.waitForSynchedBalance)(ferdiechain, 1000000n),
            (0, localchainHelpers_1.waitForSynchedBalance)(brokerchain, 5000000n),
        ]);
        const domain = 'broker.communication';
        const datastoreId = 'broker';
        const datastoreVersion = '0.0.1';
        await setupDatastore(ferdiechain, ferdie, domain, datastoreId, datastoreVersion, ferdieVotesAddress);
        (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity create --filename="${clientUserPath}"`);
        await broker.registerUser(clientUserPath, 1000000n);
        await broker.whitelistDomain(domain);
        const paymentService = await DefaultPaymentService_1.default.fromBroker(brokerAddress, {
            pemPath: clientUserPath,
        }, {
            type: 'default',
            microgons: 500000n,
        });
        const payments = [];
        const channelHolds = [];
        paymentService.on('reserved', payment => payments.push(payment));
        paymentService.on('createdChannelHold', e => channelHolds.push(e));
        datastore_testing_1.Helpers.onClose(() => paymentService.close());
        let metadata;
        const client = new client_1.default(`ulx://${domain}/@v${datastoreVersion}`, {
            paymentService,
            argonMainchainUrl,
            onQueryResult(result) {
                metadata = result.metadata;
            },
        });
        datastore_testing_1.Helpers.needsClosing.push({ close: () => client.disconnect(), onlyCloseOnFinal: false });
        const result = await client.query('SELECT * FROM default(test => $1)', [1]);
        expect(result).toEqual([{ success: true, input: { test: 1 } }]);
        expect(metadata).toEqual(expect.objectContaining({
            microgons: 50000n,
            milliseconds: expect.any(Number),
            bytes: expect.any(Number),
        }));
        expect(channelHolds).toHaveLength(1);
        expect(channelHolds[0].allocatedMicrogons).toBe(500000n);
        expect(channelHolds[0].datastoreId).toBe(datastoreId);
        expect(payments).toHaveLength(1);
        expect(payments[0].payment.microgons).toBe(50000n);
        expect(payments[0].payment.channelHold).toBeTruthy();
        expect(payments[0].payment.channelHold.settledMicrogons).toBe(50000n);
        expect(payments[0].remainingBalance).toBe(450000n);
        const clientIdentity = Identity_1.default.loadFromFile(clientUserPath);
        await expect(broker.getBalance(clientIdentity.bech32)).resolves.toBe(500000n);
    }, 300e3);
});
async function setupDatastore(localchain, domainOwner, domain, datastoreId, version, votesAddress) {
    const buildDir = (0, utils_1.getPlatformBuild)();
    {
        const registration = localchain.beginChange();
        await registration.leaseDomain(domain, await localchain.address);
        await registration.notarizeAndWaitForNotebook();
    }
    const identityBech32 = (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity read --filename="${identityPath}"`)
        .split(/\r?\n/)
        .shift()
        .trim();
    expect(identityBech32).toContain('id1');
    const cloudNode = new TestCloudNode_1.default(buildDir);
    const cloudAddress = await cloudNode.start({
        ULX_CLOUD_ADMIN_IDENTITIES: identityBech32,
        ULX_IDENTITY_PATH: identityPath,
        ULX_DATASTORE_DIR: storageDir,
        ARGON_MAINCHAIN_URL: argonMainchainUrl,
        ARGON_LOCALCHAIN_PATH: localchain.path,
        ARGON_BLOCK_REWARDS_ADDRESS: votesAddress,
        ARGON_NOTARY_ID: '1',
    });
    expect(cloudAddress).toBeTruthy();
    datastore_testing_1.Helpers.onClose(() => cloudNode.close());
    await (0, TestCloudNode_1.uploadDatastore)(datastoreId, buildDir, cloudAddress, {
        domain,
    }, identityPath);
    const domainHash = localchain_1.DomainStore.getHash(domain);
    const mainchainClient = await (0, mainchain_1.getClient)(argonMainchainUrl);
    try {
        await (0, TestMainchain_1.registerZoneRecord)(mainchainClient, domainHash, domainOwner, (0, mainchain_1.decodeAddress)(domainOwner.address, false, 42), 1, {
            [version]: mainchainClient.createType('ArgonPrimitivesDomainVersionHost', {
                datastoreId,
                host: `ws://127.0.0.1:${cloudAddress.split(':')[1]}`,
            }),
        });
    }
    finally {
        await mainchainClient.disconnect();
    }
}
//# sourceMappingURL=payments-broker.e2e.test.js.map