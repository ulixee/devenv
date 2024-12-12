"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainchain_1 = require("@argonprotocol/mainchain");
const datastore_testing_1 = require("@ulixee/datastore-testing");
const localchain_1 = require("@argonprotocol/localchain");
const IBalanceChange_1 = require("@ulixee/platform-specification/types/IBalanceChange");
const INotarization_1 = require("@ulixee/platform-specification/types/INotarization");
const ValidationError_1 = require("@ulixee/platform-specification/utils/ValidationError");
const promises_1 = require("node:fs/promises");
const Path = require("path");
const util_1 = require("util");
const env_1 = require("../env");
util_1.inspect.defaultOptions.depth = 11;
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'Datastore.clone.test');
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
test('it can serialize and deserialize a notarization', async () => {
    await (0, promises_1.mkdir)(storageDir, { recursive: true });
    const localchain = await localchain_1.Localchain.loadWithoutMainchain(Path.join(storageDir, `localchain.db`), env_1.default);
    datastore_testing_1.Helpers.onClose(() => localchain.close());
    const keyring = new mainchain_1.Keyring({ type: 'ed25519' });
    const address = keyring.addFromUri('//Alice').address;
    await localchain.keystore.importSuri('//Alice', localchain_1.CryptoScheme.Ed25519);
    const balanceBuilder = localchain.beginChange();
    await balanceBuilder.claimFromMainchain({
        transferId: 1,
        address,
        amount: 2n ** 120n,
        expirationTick: 100,
        notaryId: 1,
    });
    await balanceBuilder.leaseDomain('example.flights', address);
    await balanceBuilder.sign();
    const json = JSON.parse(await balanceBuilder.toJSON());
    expect(json.balanceChanges.find(x => x.accountType === IBalanceChange_1.AccountType.Deposit).balance).toBe((2n ** 120n - localchain_1.DOMAIN_LEASE_COST).toString());
    await INotarization_1.NotarizationSchema.parseAsync(json).catch(err => {
        throw ValidationError_1.default.fromZodValidation(`The balance change had some errors`, err);
    });
});
//# sourceMappingURL=Localchain.test.js.map