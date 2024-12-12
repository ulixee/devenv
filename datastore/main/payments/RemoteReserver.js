"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const eventUtils_1 = require("@ulixee/commons/lib/eventUtils");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const nanoid_1 = require("nanoid");
class RemoteReserver extends eventUtils_1.TypedEventEmitter {
    constructor(connectionToCore) {
        super();
        this.connectionToCore = connectionToCore;
    }
    async authenticate(identity) {
        const nonce = (0, nanoid_1.nanoid)(10);
        const message = RemoteReserver.getMessage(identity.bech32, nonce);
        const auth = await this.connectionToCore.sendRequest({
            command: 'PaymentService.authenticate',
            args: [
                {
                    authentication: {
                        identity: identity.bech32,
                        signature: identity.sign(message),
                        nonce,
                    },
                },
            ],
        });
        this.authenticationToken = auth.authenticationToken;
    }
    close() {
        return Promise.resolve();
    }
    async reserve(info) {
        if (!info.microgons || !info.recipient)
            return null;
        return await this.connectionToCore.sendRequest({
            command: 'PaymentService.reserve',
            args: [{ ...info, authenticationToken: this.authenticationToken }],
        });
    }
    async finalize(info) {
        await this.connectionToCore.sendRequest({
            command: 'PaymentService.finalize',
            args: [{ ...info, authenticationToken: this.authenticationToken }],
        });
    }
    static getMessage(identity, nonce) {
        return (0, hashUtils_1.sha256)((0, bufferUtils_1.concatAsBuffer)('PaymentService.authenticate', identity, nonce));
    }
}
exports.default = RemoteReserver;
//# sourceMappingURL=RemoteReserver.js.map