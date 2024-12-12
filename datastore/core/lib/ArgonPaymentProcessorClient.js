"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgonPaymentProcessorClient {
    constructor(serviceClient) {
        this.serviceClient = serviceClient;
    }
    getPaymentInfo() {
        return this.serviceClient.sendRequest({
            command: 'ArgonPaymentProcessor.getPaymentInfo',
            args: [],
        });
    }
    async debit(data) {
        return this.serviceClient.sendRequest({
            command: 'ArgonPaymentProcessor.debit',
            args: [data],
        });
    }
    finalize(data) {
        return this.serviceClient.sendRequest({
            command: 'ArgonPaymentProcessor.finalize',
            args: [data],
        });
    }
    async importChannelHold(data, _datastoreManifest) {
        return this.serviceClient.sendRequest({
            command: 'ArgonPaymentProcessor.importChannelHold',
            args: [data],
        });
    }
}
exports.default = ArgonPaymentProcessorClient;
//# sourceMappingURL=ArgonPaymentProcessorClient.js.map