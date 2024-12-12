"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localchain_1 = require("@argonprotocol/localchain");
const mainchain_1 = require("@argonprotocol/mainchain");
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const utils_1 = require("@ulixee/commons/lib/utils");
const net_1 = require("@ulixee/net");
const HttpTransportToCore_1 = require("@ulixee/net/lib/HttpTransportToCore");
const serdeJson_1 = require("@ulixee/platform-utils/lib/serdeJson");
const nanoid_1 = require("nanoid");
class BrokerChannelHoldSource {
    get sourceKey() {
        return `broker-${this.host.split('://').pop().replaceAll(/\.:/g, '-')}`;
    }
    constructor(host, authentication) {
        this.host = host;
        this.authentication = authentication;
        this.keyring = new mainchain_1.Keyring({ type: 'sr25519', ss58Format: localchain_1.ADDRESS_PREFIX });
        this.balanceChangeByChannelHoldId = {};
        this.connectionToCore = new net_1.ConnectionToCore(new HttpTransportToCore_1.default(this.host));
        this.loadPromise = this.load().catch(err => err);
    }
    async close() {
        await this.connectionToCore.disconnect();
    }
    async load() {
        const mnemonic = (0, mainchain_1.mnemonicGenerate)();
        this.keyring.addFromMnemonic(mnemonic);
        await this.connectionToCore.connect();
    }
    async getBalance() {
        const error = await this.loadPromise;
        if (error)
            throw error;
        const { balance } = await this.connectionToCore.sendRequest({
            command: 'Databroker.getBalance',
            args: [{ identity: this.authentication.bech32 }],
        });
        return balance;
    }
    async createChannelHold(paymentInfo, microgons) {
        const error = await this.loadPromise;
        if (error)
            throw error;
        const nonce = (0, nanoid_1.nanoid)(10);
        const signatureMessage = BrokerChannelHoldSource.createSignatureMessage(paymentInfo.domain, paymentInfo.id, this.authentication.publicKey, microgons, nonce);
        const holdDetails = await this.connectionToCore.sendRequest({
            command: 'Databroker.createChannelHold',
            args: [
                {
                    domain: paymentInfo.domain,
                    datastoreId: paymentInfo.id,
                    recipient: paymentInfo.recipient,
                    microgons,
                    delegatedSigningAddress: this.keyring.pairs[0].address,
                    authentication: {
                        identity: this.authentication.bech32,
                        signature: this.authentication.sign(signatureMessage),
                        nonce,
                    },
                },
            ],
        });
        this.balanceChangeByChannelHoldId[holdDetails.channelHoldId] = holdDetails.balanceChange;
        return holdDetails;
    }
    async updateChannelHoldSettlement(channelHold, updatedSettlement) {
        const balanceChange = this.balanceChangeByChannelHoldId[channelHold.id];
        // TODO: add a way to retrieve the balance change from the broker
        if (!balanceChange)
            throw new Error(`No balance change found for channel hold ${channelHold.id}`);
        balanceChange.notes[0].microgons = updatedSettlement;
        balanceChange.balance = balanceChange.previousBalanceProof.balance - updatedSettlement;
        const json = (0, serdeJson_1.default)(balanceChange);
        const bytes = localchain_1.BalanceChangeBuilder.toSigningMessage(json);
        const signature = this.keyring.getPairs()[0].sign(bytes, { withType: true });
        balanceChange.signature = Buffer.from(signature);
        channelHold.settledSignature = balanceChange.signature;
        channelHold.settledMicrogons = updatedSettlement;
    }
    static createSignatureMessage(domain, datastoreId, identity, microgons, nonce) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('Databroker.createChannelHold', identity, nonce, domain, datastoreId, microgons.toString()));
    }
    static async getBalance(host, identity) {
        const brokerUrl = (0, utils_1.toUrl)(host);
        const remoteTransport = new HttpTransportToCore_1.default(brokerUrl.href);
        const connectionToCore = new net_1.ConnectionToCore(remoteTransport);
        const x = await connectionToCore.sendRequest({
            command: 'Databroker.getBalance',
            args: [{ identity }],
        });
        return x.balance;
    }
}
exports.default = BrokerChannelHoldSource;
//# sourceMappingURL=BrokerChannelHoldSource.js.map