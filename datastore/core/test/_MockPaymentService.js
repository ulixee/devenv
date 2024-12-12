"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const IBalanceChange_1 = require("@ulixee/platform-specification/types/IBalanceChange");
const nanoid_1 = require("nanoid");
class MockPaymentService extends eventUtils_1.TypedEventEmitter {
    constructor(clientAddress, client, paymentInfo, name) {
        super();
        this.clientAddress = clientAddress;
        this.client = client;
        this.paymentInfo = paymentInfo;
        this.name = name;
        this.paymentsByDatastoreId = {};
        this.channelHoldsById = {};
        this.payments = [];
    }
    async close() {
        return null;
    }
    async getPaymentInfo() {
        return this.paymentInfo;
    }
    async reserve(info) {
        const paymentId = (0, nanoid_1.nanoid)();
        let channelHoldId = this.paymentsByDatastoreId[info.id]?.channelHoldId;
        if (!channelHoldId) {
            channelHoldId = (0, bufferUtils_1.encodeBuffer)((0, hashUtils_1.sha256)((0, nanoid_1.nanoid)()), 'chan');
            this.paymentsByDatastoreId[info.id] = {
                channelHoldId,
            };
            let microgons = info.microgons * 100n;
            if (microgons < 5000n) {
                microgons = 5000n;
            }
            this.channelHoldsById[channelHoldId] = { channelHoldAmount: microgons, tick: 1 };
            await this.client.registerChannelHold(info.id, {
                accountId: this.clientAddress.address,
                accountType: IBalanceChange_1.AccountType.Deposit,
                balance: 20000000n - microgons,
                previousBalanceProof: {
                    balance: 20000000n,
                    notaryId: info.recipient.notaryId,
                    accountOrigin: { notebookNumber: 1, accountUid: 1 },
                    notebookNumber: 1,
                    notebookProof: {
                        leafIndex: 0,
                        numberOfLeaves: 1,
                        proof: [],
                    },
                    tick: 1,
                },
                channelHoldNote: {
                    noteType: { action: 'channelHold', recipient: info.recipient.address },
                    microgons,
                },
                notes: [{ microgons: 5000n, noteType: { action: 'channelHoldSettle' } }],
                changeNumber: 2,
                signature: Buffer.from(this.clientAddress.sign('siggy', { withType: true })),
            });
        }
        let settle = 5000n;
        if (info.microgons > settle) {
            settle = BigInt(Math.ceil(Number(info.microgons) / 1000) * 1000);
        }
        return {
            channelHold: {
                id: channelHoldId,
                settledMicrogons: settle,
                settledSignature: Buffer.from(this.clientAddress.sign('siggy', { withType: true })),
            },
            microgons: info.microgons,
            uuid: paymentId,
        };
    }
    async finalize(info) {
        this.payments.push(info);
    }
}
exports.default = MockPaymentService;
//# sourceMappingURL=_MockPaymentService.js.map