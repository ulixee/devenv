"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sidechain_1 = require("@ulixee/sidechain");
const Identity_1 = require("@ulixee/crypto/lib/Identity");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const datastore_1 = require("@ulixee/datastore");
const PaymentProcessor_1 = require("../lib/PaymentProcessor");
const SidechainClientManager_1 = require("../lib/SidechainClientManager");
const identitySpy = jest.spyOn(Identity_1.default, 'verify');
const sidechainIdentity = Identity_1.default.createSync();
const micronoteBatchIdentity = Identity_1.default.createSync();
const sidechainClient = new sidechain_1.default('123', {});
const holdSpy = jest.spyOn(sidechainClient, 'holdMicronoteFunds');
const settleSpy = jest.spyOn(sidechainClient, 'settleMicronote');
jest.spyOn(sidechainClient, 'getSettings').mockImplementation(async () => {
    return {
        latestBlockSettings: { height: 0 },
        settlementFeeMicrogons: 5,
    };
});
const sidechainClientManager = new SidechainClientManager_1.default({});
jest.spyOn(sidechainClientManager, 'withIdentity').mockImplementation(async () => sidechainClient);
jest
    .spyOn(sidechainClientManager, 'getApprovedSidechainRootIdentities')
    .mockImplementation(async () => new Set([sidechainIdentity.bech32]));
const payment = {
    micronote: {
        microgons: 1000,
        sidechainIdentity: sidechainIdentity.bech32,
        micronoteBatchIdentity: micronoteBatchIdentity.bech32,
        guaranteeBlockHeight: 0,
        micronoteSignature: micronoteBatchIdentity.sign((0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('1', 1000))),
        micronoteId: '1',
        batchSlug: '123',
        blockHeight: 0,
        micronoteBatchUrl: '',
        sidechainValidationSignature: sidechainIdentity.sign((0, hashUtils_1.sha256)(micronoteBatchIdentity.bech32)),
    },
};
test('it should ensure a payment has enough microgons', async () => {
    const processor = new PaymentProcessor_1.default({
        micronote: {
            microgons: 100,
            sidechainIdentity: sidechainIdentity.bech32,
        },
    }, new datastore_1.default({}), {
        sidechainClientManager,
        configuration: {
            computePricePerQuery: 0,
            paymentAddress: null,
        },
    });
    await expect(processor.createHold({
        extractorsByName: {
            fun1: { prices: [{ perQuery: 100, minimum: 100 }] },
        },
        paymentAddress: 'ar1',
    }, [{ id: 1, name: 'fun1' }])).rejects.toThrow('insufficient');
});
test('it should allow adding multiple payees', async () => {
    identitySpy.mockReset();
    const processor = new PaymentProcessor_1.default(payment, new datastore_1.default({}), {
        sidechainClientManager,
        configuration: {
            computePricePerQuery: 1,
            paymentAddress: 'ar2',
        },
    });
    holdSpy.mockImplementationOnce(() => Promise.resolve({ accepted: true }));
    await expect(processor.createHold({
        extractorsByName: {
            fun1: { prices: [{ perQuery: 100, minimum: 100 }] },
            fun2: { prices: [{ perQuery: 600, minimum: 600 }] },
        },
        paymentAddress: 'ar1',
    }, [
        { id: 1, name: 'fun1' },
        { id: 2, name: 'fun2' },
    ])).resolves.toBe(true);
    // @ts-expect-error
    expect(processor.microgonsToHold).toBe(701);
    expect(holdSpy).toHaveBeenCalledTimes(1);
    expect(identitySpy).toHaveBeenCalledTimes(2);
});
test('it should allow an function to charge per kb', async () => {
    const processor = new PaymentProcessor_1.default(payment, new datastore_1.default({}), {
        sidechainClientManager,
        configuration: {
            computePricePerQuery: 5,
            paymentAddress: 'ar2',
        },
    });
    holdSpy.mockImplementationOnce(() => Promise.resolve({
        accepted: true,
        holdId: 'hold456',
        holdAuthorizationCode: '2',
        remainingBalance: 600,
        currentBlockHash: null,
        currentBlockHeight: 1,
    }));
    settleSpy.mockImplementationOnce(() => Promise.resolve({ finalCost: 611 }));
    await expect(processor.createHold({
        extractorsByName: {
            fun1: { prices: [{ perQuery: 500, minimum: 500 }] },
            fun2: { prices: [{ perQuery: 100, addOns: { perKb: 1 }, minimum: 100 }] },
        },
        paymentAddress: 'ar1',
    }, [
        { id: 1, name: 'fun1' },
        { id: 2, name: 'fun2' },
    ])).resolves.toBe(true);
    expect(processor.releaseLocalFunctionHold(1, 1e3)).toBe(500);
    expect(processor.releaseLocalFunctionHold(2, 1e3)).toBe(101);
    const finalMicrogons = await processor.settle(1e3);
    expect(finalMicrogons).toBe(611);
    expect(settleSpy).toHaveBeenCalledTimes(1);
    expect(settleSpy).toHaveBeenCalledWith('1', '123', 'hold456', { ar1: 601, ar2: 5 }, true);
});
test('the processor should take all available funds if a query exceeds the microgon allocation', async () => {
    const processor = new PaymentProcessor_1.default(payment, new datastore_1.default({}), {
        sidechainClientManager,
        configuration: {
            computePricePerQuery: 1,
            paymentAddress: 'ar2',
        },
    });
    holdSpy.mockImplementationOnce(() => Promise.resolve({
        accepted: true,
        holdId: 'hold456',
        holdAuthorizationCode: '2',
        remainingBalance: 5,
        currentBlockHash: null,
        currentBlockHeight: 1,
    }));
    settleSpy.mockImplementationOnce(() => Promise.resolve({ finalCost: 605 }));
    settleSpy.mockClear();
    await expect(processor.createHold({
        extractorsByName: {
            fun1: { prices: [{ perQuery: 494, minimum: 494 }] },
            fun2: { prices: [{ perQuery: 500, minimum: 500, addOns: { perKb: 1 } }] },
        },
        paymentAddress: 'ar1',
    }, [
        { id: 1, name: 'fun1' },
        { id: 2, name: 'fun2' },
    ])).resolves.toBe(true);
    expect(processor.releaseLocalFunctionHold(1, 1e3)).toBe(494);
    expect(processor.releaseLocalFunctionHold(2, 1e3)).toBe(501);
    await expect(processor.settle(23)).rejects.toThrow('will not cover');
    expect(settleSpy).toHaveBeenCalledTimes(1);
    expect(settleSpy).toHaveBeenCalledWith('1', '123', 'hold456', { ar1: 994, ar2: 1 }, true);
});
//# sourceMappingURL=PaymentProcessor.test.js.map