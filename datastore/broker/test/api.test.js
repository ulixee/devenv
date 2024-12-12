"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainchain_1 = require("@argonprotocol/mainchain");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const BrokerChannelHoldSource_1 = require("@ulixee/datastore/payments/BrokerChannelHoldSource");
const LocalchainWithSync_1 = require("@ulixee/datastore/payments/LocalchainWithSync");
const localchain_1 = require("@argonprotocol/localchain");
const net_1 = require("@ulixee/net");
const Identity_1 = require("@ulixee/platform-utils/lib/Identity");
const Fs = require("node:fs");
const Path = require("node:path");
const serdeJson_1 = require("@ulixee/platform-utils/lib/serdeJson");
const index_1 = require("../index");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'broker.api.test');
beforeAll(async () => {
    jest.spyOn(LocalchainWithSync_1.default.prototype, 'load').mockImplementation(() => Promise.resolve());
    jest.spyOn(LocalchainWithSync_1.default.prototype, 'timeForTick').mockImplementation(ticks => new Date());
    const account = new mainchain_1.Keyring().addFromUri('//Alice');
    jest.spyOn(LocalchainWithSync_1.default.prototype, 'transactions', 'get').mockImplementation(() => {
        return {
            createChannelHold: async () => {
                return {
                    channelHold: {
                        id: 'test',
                        settledAmount: 0n,
                        expirationTick: 0,
                    },
                    exportForSend: async () => {
                        return (0, serdeJson_1.default)({
                            accountId: account.address,
                            changeNumber: 0,
                            balance: 100000n,
                            notes: [{ microgons: 5000n, noteType: { action: 'channelHoldSettle' } }],
                            signature: Buffer.from(account.sign(Buffer.from('test'), { withType: true })),
                            microgons: '100',
                            previousBalanceProof: null,
                            accountType: 'deposit',
                            channelHoldNote: {
                                microgons: 100000n,
                                noteType: {
                                    action: 'channelHold',
                                    recipient: account.address,
                                    domainHash: (0, hashUtils_1.sha256)('test.flights'),
                                },
                            },
                        });
                    },
                };
            },
        };
    });
});
beforeEach(() => {
    if (Fs.existsSync(storageDir))
        Fs.rmSync(storageDir, { recursive: true });
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
const mainchainIdentity = {
    chain: localchain_1.Chain.Devnet,
    genesisHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
};
it('can create channelHolds', async () => {
    const broker = new index_1.default({ storageDir });
    datastore_testing_1.Helpers.needsClosing.push(broker);
    await broker.listen();
    await broker.listenAdmin(0);
    const identity = await Identity_1.default.create();
    await registerUser(broker, identity);
    const brokerHost = (0, utils_1.toUrl)(await broker.host, 'http:');
    const datastoreKeyPair = new mainchain_1.Keyring({
        ss58Format: localchain_1.ADDRESS_PREFIX,
    }).createFromUri('//Bob');
    const client = new BrokerChannelHoldSource_1.default(brokerHost.href, identity);
    broker.getApiContext('').datastoreWhitelist.add('test.flights');
    const channelHold = await client.createChannelHold({
        host: '127.0.0.1',
        microgons: 100000n,
        recipient: {
            address: datastoreKeyPair.address,
            notaryId: 1,
            ...mainchainIdentity,
        },
        id: 'test',
        version: '1.0.0',
        domain: 'test.flights',
    }, 100000n);
    expect(channelHold.channelHoldId).toBeTruthy();
    expect(channelHold.balanceChange.channelHoldNote.microgons).toBe(100000n);
    const db = broker.getApiContext('').db;
    expect(db.channelHolds.countOpen()).toBe(1);
    expect(db.channelHolds.pendingBalance()).toBe(100000n);
    expect(db.organizations.list()[0].balance).toBe(0n);
    expect(db.organizations.list()[0].balanceInChannelHolds).toBe(100000n);
    await broker.onLocalchainSync({
        channelHoldNotarizations: [
            {
                channelHolds: [
                    {
                        id: channelHold.channelHoldId,
                        settledAmount: 80n,
                    },
                ],
            },
        ],
    });
    expect(db.channelHolds.countOpen()).toBe(0);
    expect(db.channelHolds.pendingBalance()).toBe(0n);
    expect(db.organizations.list()[0].balance).toBe(99920n);
});
test('it rejects invalid signing requests', async () => {
    const broker = new index_1.default({ storageDir });
    datastore_testing_1.Helpers.needsClosing.push(broker);
    await broker.listen();
    await broker.listenAdmin(0);
    const identity = await Identity_1.default.create();
    await registerUser(broker, identity);
    const brokerHost = (0, utils_1.toUrl)(await broker.host, 'http:');
    broker.getApiContext('').datastoreWhitelist.add('test.flights');
    const datastoreKeyPair = new mainchain_1.Keyring({
        ss58Format: localchain_1.ADDRESS_PREFIX,
    }).createFromUri('//Bob');
    const paymentInfo = {
        host: '127.0.0.1',
        microgons: 50n,
        recipient: {
            address: datastoreKeyPair.address,
            notaryId: 1,
            ...mainchainIdentity,
        },
        id: 'test',
        version: '1.0.0',
        domain: 'test.flights',
    };
    const client = new BrokerChannelHoldSource_1.default(brokerHost.href, await Identity_1.default.create());
    await expect(client.createChannelHold(paymentInfo, 100n)).rejects.toThrow('Organization not found');
    jest
        .spyOn(BrokerChannelHoldSource_1.default, 'createSignatureMessage')
        .mockImplementationOnce(() => (0, hashUtils_1.sha256)('bad data'));
    const client2 = new BrokerChannelHoldSource_1.default(brokerHost.href, identity);
    await expect(client2.createChannelHold(paymentInfo, 100n)).rejects.toThrow('Invalid signature');
});
async function registerUser(dataBroker, identity) {
    const adminUrl = await dataBroker.adminHost;
    const adminTransport = new net_1.WsTransportToCore(adminUrl.replace('http:', 'ws:'));
    const adminConnection = new net_1.ConnectionToCore(adminTransport);
    datastore_testing_1.Helpers.onClose(() => adminConnection.disconnect());
    await adminConnection.connect();
    const response = adminConnection.sendRequest({
        command: 'Organization.create',
        args: [
            {
                name: 'test',
                balance: 100000n,
            },
        ],
    });
    await expect(response).resolves.toMatchObject({ id: expect.any(String) });
    const { id } = await response;
    const userResponse = await adminConnection.sendRequest({
        command: 'User.create',
        args: [
            {
                name: 'test',
                identity: identity.bech32,
                organizationId: id,
            },
        ],
    });
    expect(userResponse).toEqual({
        success: true,
    });
    await adminConnection.disconnect();
}
//# sourceMappingURL=api.test.js.map