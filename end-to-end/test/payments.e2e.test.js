"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const mainchain_1 = require("@argonprotocol/mainchain");
const client_1 = require("@ulixee/client");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const DatastoreApiClients_1 = require("@ulixee/datastore/lib/DatastoreApiClients");
const LocalchainWithSync_1 = require("@ulixee/datastore/payments/LocalchainWithSync");
const objectUtils_1 = require("@ulixee/platform-utils/lib/objectUtils");
const Path = require("node:path");
const node_util_1 = require("node:util");
const util_1 = require("util");
const TestCloudNode_1 = require("../lib/TestCloudNode");
const testHelpers_1 = require("../lib/testHelpers");
const TestMainchain_1 = require("../lib/TestMainchain");
const TestNotary_1 = require("../lib/TestNotary");
const utils_1 = require("../lib/utils");
const promises_1 = require("node:fs/promises");
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'e2e.payments.test');
let argonMainchainUrl;
const identityPath = Path.join(storageDir, 'DatastoreDev.pem');
let ferdie;
util_1.inspect.defaultOptions.depth = 10;
// this stops jest from killing the logs
global.console.log = (...args) => process.stdout.write(`${(0, node_util_1.format)(...args)}\n`);
(0, testHelpers_1.describeIntegration)('Payments E2E', () => {
    beforeAll(async () => {
        const mainchain = new TestMainchain_1.default();
        argonMainchainUrl = await mainchain.launch(1);
        const notary = new TestNotary_1.default();
        await notary.start(argonMainchainUrl);
        await (0, promises_1.mkdir)(storageDir, { recursive: true });
        ferdie = new mainchain_1.Keyring({ type: 'sr25519' }).createFromUri('//Ferdie');
        const sudo = new mainchain_1.Keyring({ type: 'sr25519' }).createFromUri('//Alice');
        const mainchainClient = await (0, mainchain_1.getClient)(argonMainchainUrl);
        await (0, TestMainchain_1.activateNotary)(sudo, mainchainClient, notary);
        await mainchainClient.disconnect();
        (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity create --filename="${identityPath}"`);
        (0, utils_1.execAndLog)(`npx @argonprotocol/localchain accounts create --name=bobchain --suri="//Bob" --scheme=sr25519 --base-dir="${storageDir}"`);
    }, 60e3);
    test('it can do end to end payments flow for a domain datastore', async () => {
        const buildDir = (0, utils_1.getPlatformBuild)();
        const mainchainClient = await (0, mainchain_1.getClient)(argonMainchainUrl);
        datastore_testing_1.Helpers.onClose(() => mainchainClient.disconnect());
        const bobchain = await LocalchainWithSync_1.default.load({
            localchainPath: Path.join(storageDir, 'bobchain.db'),
            mainchainUrl: argonMainchainUrl,
            disableAutomaticSync: true,
            channelHoldAllocationStrategy: {
                type: 'multiplier',
                queries: 2,
            },
        });
        (0, utils_1.execAndLog)(`npx @argonprotocol/localchain accounts create --name=ferdiechain --suri="//Ferdie" --scheme=sr25519 --base-dir="${storageDir}"`);
        const ferdiechain = await localchain_1.Localchain.load({
            mainchainUrl: argonMainchainUrl,
            path: Path.join(storageDir, 'ferdiechain.db'),
        });
        datastore_testing_1.Helpers.onClose(() => ferdiechain.close());
        const ferdieVotesAddress = ferdie.derive('//votes').address;
        const domain = 'e2e.communication';
        // Hangs with the proxy url. Not sure why
        if (!process.env.ULX_USE_DOCKER_BINS) {
            const isDomainRegistered = (0, utils_1.execAndLog)(`npx @argonprotocol/localchain domains check ${domain} -m "${argonMainchainUrl}"`);
            expect(isDomainRegistered).toContain(' No ');
            console.log('Domain registered?', isDomainRegistered);
        }
        const domainHash = localchain_1.DomainStore.getHash(domain);
        await Promise.all([
            ferdiechain.mainchainTransfers.sendToLocalchain(1000000n, 1),
            bobchain.mainchainTransfers.sendToLocalchain(5000000n, 1),
        ]);
        let isSynched = false;
        while (!isSynched) {
            await ferdiechain.balanceSync.sync({});
            await bobchain.balanceSync.sync({});
            const ferdieOverview = await ferdiechain.accountOverview();
            const bobOverview = await bobchain.accountOverview();
            isSynched = ferdieOverview.balance === 1000000n && bobOverview.balance === 5000000n;
            await new Promise(resolve => setTimeout(resolve, Number(ferdiechain.ticker.millisToNextTick())));
        }
        {
            const ferdieChange = ferdiechain.beginChange();
            await ferdieChange.leaseDomain(domain, await ferdiechain.address);
            await ferdieChange.notarizeAndWaitForNotebook();
        }
        const identityBech32 = (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity read --filename="${identityPath}"`)
            .split(/\r?\n/)
            .shift()
            .trim();
        expect(identityBech32).toContain('id1');
        const cloudNode = new TestCloudNode_1.default(buildDir, false);
        const cloudAddress = await cloudNode.start({
            ULX_CLOUD_ADMIN_IDENTITIES: identityBech32,
            ULX_IDENTITY_PATH: identityPath,
            ULX_DATASTORE_DIR: storageDir,
            ARGON_MAINCHAIN_URL: argonMainchainUrl,
            ARGON_LOCALCHAIN_PATH: ferdiechain.path,
            ARGON_BLOCK_REWARDS_ADDRESS: ferdieVotesAddress,
            ARGON_NOTARY_ID: '1',
            RUST_LOG: 'debug,sqlx=warn',
        });
        expect(cloudAddress).toBeTruthy();
        datastore_testing_1.Helpers.onClose(() => cloudNode.close());
        const datastoreId = 'end-to-end';
        const datastoreVersion = '0.0.1';
        await (0, TestCloudNode_1.uploadDatastore)(datastoreId, buildDir, cloudAddress, {
            domain,
        }, identityPath);
        await (0, TestMainchain_1.registerZoneRecord)(mainchainClient, domainHash, ferdie, (0, mainchain_1.decodeAddress)(ferdie.address, false, 42), 1, {
            [datastoreVersion]: mainchainClient.createType('ArgonPrimitivesDomainVersionHost', {
                datastoreId: mainchainClient.createType('Bytes', datastoreId),
                host: mainchainClient.createType('Bytes', `ws://127.0.0.1:${cloudAddress.split(':')[1]}`),
            }),
        });
        const datastoreApiClients = new DatastoreApiClients_1.default();
        datastore_testing_1.Helpers.onClose(() => datastoreApiClients.close());
        const paymentService = await bobchain.createPaymentService(datastoreApiClients);
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
            microgons: 500000n,
            milliseconds: expect.any(Number),
            bytes: expect.any(Number),
        }));
        expect(channelHolds).toHaveLength(1);
        expect(channelHolds[0].allocatedMicrogons).toBe(1000000n);
        expect(channelHolds[0].datastoreId).toBe(datastoreId);
        expect(payments).toHaveLength(1);
        expect(payments[0].payment.microgons).toBe(500000n);
        expect(payments[0].payment.channelHold).toBeTruthy();
        expect(payments[0].payment.channelHold.settledMicrogons).toBe(500000n);
        expect(payments[0].remainingBalance).toBe(500000n);
        const balance = await bobchain.accountOverview();
        console.log('Balance:', await (0, objectUtils_1.gettersToObject)(balance));
        expect(balance.balance).toBe(4800000n);
        expect(balance.heldBalance).toBe(1000000n);
    }, 300e3);
    test('it can do end to end payments with no domain', async () => {
        const buildDir = (0, utils_1.getPlatformBuild)();
        const identityBech32 = (0, utils_1.execAndLog)(`npx @ulixee/datastore admin-identity read --filename="${identityPath}"`)
            .split(/\r?\n/)
            .shift()
            .trim();
        expect(identityBech32).toContain('id1');
        const cloudNode = new TestCloudNode_1.default(buildDir, false);
        const cloudAddress = await cloudNode.start({
            ULX_CLOUD_ADMIN_IDENTITIES: identityBech32.trim(),
            ULX_IDENTITY_PATH: identityPath,
            ULX_DATASTORE_DIR: storageDir,
            ARGON_MAINCHAIN_URL: argonMainchainUrl,
            ARGON_LOCALCHAIN_PATH: Path.join(storageDir, 'ferdiechain.db'),
            ARGON_NOTARY_ID: '1',
        });
        expect(cloudAddress).toBeTruthy();
        await (0, TestCloudNode_1.uploadDatastore)('no-domain', buildDir, cloudAddress, {
            version: '0.0.2',
        }, identityPath);
        const bobchain = await LocalchainWithSync_1.default.load({
            localchainPath: Path.join(storageDir, 'bobchain.db'),
            mainchainUrl: argonMainchainUrl,
            channelHoldAllocationStrategy: {
                type: 'multiplier',
                queries: 2,
            },
        });
        datastore_testing_1.Helpers.onClose(() => bobchain.close());
        const wallet = await bobchain.accountOverview();
        // ensure wallet is loaded
        expect(wallet.balance).toBe(4800000n);
        const paymentService = await bobchain.createPaymentService(new DatastoreApiClients_1.default());
        const payments = [];
        const channelHolds = [];
        paymentService.on('reserved', payment => payments.push(payment));
        paymentService.on('createdChannelHold', e => channelHolds.push(e));
        let metadata;
        const client = new client_1.default(`ulx://${cloudAddress}/no-domain@v0.0.2`, {
            paymentService,
            argonMainchainUrl,
            onQueryResult(result) {
                metadata = result.metadata;
            },
        });
        datastore_testing_1.Helpers.onClose(() => client.disconnect());
        const result = await client.query('SELECT * FROM nod()');
        expect(result).toEqual([{ noDomain: true }]);
        expect(metadata).toEqual(expect.objectContaining({
            microgons: 1000n,
            milliseconds: expect.any(Number),
            bytes: expect.any(Number),
        }));
        expect(channelHolds).toHaveLength(1);
        expect(channelHolds[0].allocatedMicrogons).toBe(5000n);
        expect(channelHolds[0].datastoreId).toBe('no-domain');
        expect(payments).toHaveLength(1);
        expect(payments[0].payment.microgons).toBe(1000n);
        expect(payments[0].payment.channelHold).toBeTruthy();
        expect(payments[0].payment.channelHold.settledMicrogons).toBe(5000n);
        expect(payments[0].remainingBalance).toBe(5000n - 1000n);
        const balance = await bobchain.accountOverview();
        console.log('Balance:', await (0, objectUtils_1.gettersToObject)(balance));
        // only sending 205_000 to jump account, means we'll only pay 20% on the amount
        expect(balance.balance).toBe(4800000n - BigInt(205_000 * 0.2));
        expect(balance.heldBalance).toBe(1005000n);
    });
});
//# sourceMappingURL=payments.e2e.test.js.map