"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _LocalchainWithSync_localchain;
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const mainchain_1 = require("@argonprotocol/mainchain");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const nativeUtils_1 = require("@ulixee/platform-utils/lib/nativeUtils");
const objectUtils_1 = require("@ulixee/platform-utils/lib/objectUtils");
const Path = require("node:path");
const env_1 = require("../env");
const DatastoreLookup_1 = require("../lib/DatastoreLookup");
const DefaultPaymentService_1 = require("./DefaultPaymentService");
const { log } = (0, Logger_1.default)(module);
class LocalchainWithSync extends eventUtils_1.TypedEventEmitter {
    get accounts() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").accounts;
    }
    get domains() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").domains;
    }
    get openChannelHolds() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").openChannelHolds;
    }
    get balanceSync() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").balanceSync;
    }
    get transactions() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").transactions;
    }
    get ticker() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").ticker;
    }
    get mainchainTransfers() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").mainchainTransfers;
    }
    get mainchainClient() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").mainchainClient;
    }
    get keystore() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").keystore;
    }
    get inner() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").name;
    }
    get path() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").path;
    }
    get currentTick() {
        return __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").currentTick;
    }
    constructor(localchainConfig = {}) {
        super();
        this.localchainConfig = localchainConfig;
        _LocalchainWithSync_localchain.set(this, void 0);
        this.enableLogging = true;
        this.paymentInfo = new Resolvable_1.default();
        this.mainchainLoaded = new Resolvable_1.default();
        this.localchainConfig.mainchainUrl ||= env_1.default.argonMainchainUrl;
        if (this.localchainConfig.localchainName && !this.localchainConfig.localchainPath) {
            let dbName = this.localchainConfig.localchainName;
            if (!dbName.endsWith('.db')) {
                dbName += '.db';
            }
            this.localchainConfig.localchainPath = Path.join(localchain_1.Localchain.getDefaultDir(), dbName);
        }
    }
    async load() {
        const { mainchainUrl, localchainPath } = this.localchainConfig;
        let defaultPath = localchainPath ?? localchain_1.Localchain.getDefaultPath();
        if (!defaultPath.endsWith('.db')) {
            defaultPath = Path.join(defaultPath, 'primary.db');
        }
        log.info(`Loading ${mainchainUrl ? 'online' : 'offline'} localchain`, {
            localchainPath: defaultPath,
        });
        const keystorePassword = this.getPassword();
        __classPrivateFieldSet(this, _LocalchainWithSync_localchain, await localchain_1.Localchain.loadWithoutMainchain(defaultPath, {
            tickDurationMillis: env_1.default.tickDurationMillis,
            ntpPoolUrl: env_1.default.ntpPoolUrl,
            channelHoldExpirationTicks: env_1.default.channelHoldExpirationTicks,
        }, keystorePassword), "f");
        // We wrap this (as of 10/2024) because nodejs doesn't handle async stack traces, so code
        // appears to die in the middle of nowhere
        __classPrivateFieldSet(this, _LocalchainWithSync_localchain, (0, nativeUtils_1.proxyWrapper)(__classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f")), "f");
        if (mainchainUrl) {
            await Promise.race([
                new Promise(resolve => setTimeout(resolve, 2e3)),
                this.connectToMainchain(mainchainUrl)
                    .then(async () => {
                    this.datastoreLookup = new DatastoreLookup_1.default(__classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").mainchainClient);
                    return null;
                })
                    .catch(error => {
                    log.error('Error connecting to mainchain', { error });
                }),
            ]);
        }
        this.afterLoad();
    }
    async bindToExportedAccount(accountJson, passphrase) {
        const keyring = new mainchain_1.Keyring();
        const pair = keyring.addFromJson(accountJson);
        pair.decodePkcs8(passphrase);
        await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").keystore.useExternal(pair.address, async (address, signatureMessage) => {
            let hasPair = true;
            try {
                keyring.getPair(address);
            }
            catch (e) {
                hasPair = false;
            }
            if (!hasPair) {
                const accounts = await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").accounts.list(true);
                const account = accounts.find(x => x.address === address);
                if (!account) {
                    throw new Error(`Account not found for address: ${address}`);
                }
                const derived = pair.derive(account.hdPath);
                keyring.addPair(derived);
            }
            return keyring.getPair(address)?.sign(signatureMessage, { withType: true });
        }, async (hdPath) => {
            const derived = pair.derive(hdPath);
            keyring.addPair(derived);
            return derived.address;
        });
    }
    async createIfMissing(account) {
        const accounts = await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").accounts.list();
        if (accounts.length)
            return;
        log.info('Creating localchain', { path: localchain_1.Localchain.getDefaultPath() });
        if (account?.suri) {
            const keystorePassword = this.getPassword();
            await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").keystore.importSuri(account.suri, account.cryptoScheme ?? localchain_1.CryptoScheme.Sr25519, keystorePassword);
        }
        else {
            await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").keystore.bootstrap();
        }
    }
    async close() {
        clearTimeout(this.nextTick);
        this.datastoreLookup = null;
        await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f")?.close();
        await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f")?.mainchainClient.then(x => x?.close());
        __classPrivateFieldSet(this, _LocalchainWithSync_localchain, null, "f");
    }
    async connectToMainchain(argonMainchainUrl, timeoutMs = 10e3) {
        try {
            const mainchain = await localchain_1.MainchainClient.connect(argonMainchainUrl, timeoutMs);
            await this.attachMainchain(mainchain);
        }
        catch (error) {
            this.mainchainLoaded.reject(error);
            log.error('Error connecting to mainchain', { error });
        }
    }
    async attachMainchain(mainchain) {
        if (!__classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f"))
            return;
        await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").attachMainchain(mainchain);
        await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").updateTicker();
        this.mainchainLoaded.resolve();
    }
    async accountOverview() {
        return await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").accountOverview();
    }
    timeForTick(tick) {
        return new Date(Number(__classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").ticker.timeForTick(tick)));
    }
    async createPaymentService(datastoreClients) {
        return await DefaultPaymentService_1.default.fromOpenLocalchain(this, undefined, datastoreClients);
    }
    getPassword() {
        let keystorePassword = this.localchainConfig.keystorePassword;
        if (keystorePassword &&
            !keystorePassword.password &&
            !keystorePassword.passwordFile &&
            !keystorePassword.interactiveCli) {
            keystorePassword = undefined;
        }
        return keystorePassword;
    }
    afterLoad() {
        const { keystorePassword, notaryId } = this.localchainConfig;
        this.address = __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").address.catch(() => null);
        // remove password from memory
        if (Buffer.isBuffer(keystorePassword?.password)) {
            keystorePassword.password.fill(0);
            delete keystorePassword.password;
        }
        void this.accountOverview()
            // eslint-disable-next-line promise/always-return
            .then(x => {
            this.paymentInfo.resolve({
                address: x.address,
                ...x.mainchainIdentity,
                notaryId,
            });
        })
            .catch(this.paymentInfo.reject);
        this.scheduleNextTick();
    }
    scheduleNextTick() {
        clearTimeout(this.nextTick);
        if (this.localchainConfig.disableAutomaticSync === true) {
            return;
        }
        let millisToNextTick = Number(__classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").ticker.millisToNextTick());
        if (Number.isNaN(millisToNextTick) || millisToNextTick < 0) {
            millisToNextTick = 1000;
        }
        this.nextTick = setTimeout(async () => {
            try {
                this.isSynching = true;
                const result = await __classPrivateFieldGet(this, _LocalchainWithSync_localchain, "f").balanceSync.sync({
                    votesAddress: this.localchainConfig.blockRewardsAddress,
                });
                this.emit('sync', result);
                if (this.enableLogging) {
                    if (result.blockVotes.length ||
                        result.balanceChanges.length ||
                        result.mainchainTransfers.length ||
                        result.channelHoldsUpdated.length ||
                        result.channelHoldNotarizations.length) {
                        log.info('Localchain Sync result', {
                            // have to weirdly jsonify
                            balanceChanges: await Promise.all(result.balanceChanges.map(objectUtils_1.gettersToObject)),
                            channelHoldNotarizations: await Promise.all(result.channelHoldNotarizations.map(objectUtils_1.gettersToObject)),
                            mainchainTransfers: await Promise.all(result.mainchainTransfers.map(objectUtils_1.gettersToObject)),
                            channelHoldsUpdated: await Promise.all(result.channelHoldsUpdated.map(objectUtils_1.gettersToObject)),
                            blockVotes: await Promise.all(result.blockVotes.map(objectUtils_1.gettersToObject)),
                        });
                    }
                }
            }
            catch (error) {
                log.error('Error synching channelHold balance changes', { error });
            }
            finally {
                this.isSynching = false;
                this.scheduleNextTick();
            }
        }, millisToNextTick).unref();
    }
    static async load(config) {
        const localchain = new LocalchainWithSync(config);
        await localchain.load();
        return localchain;
    }
}
_LocalchainWithSync_localchain = new WeakMap();
exports.default = LocalchainWithSync;
//# sourceMappingURL=LocalchainWithSync.js.map