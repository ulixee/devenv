"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgonPaymentProcessor_1 = require("../lib/ArgonPaymentProcessor");
class MockArgonPaymentProcessor {
    constructor() {
        this.canSign = jest.spyOn(ArgonPaymentProcessor_1.default.prototype, 'canSign');
        this.updateSettlement = jest.spyOn(ArgonPaymentProcessor_1.default.prototype, 'updateSettlement');
        this.importToLocalchain = jest.spyOn(ArgonPaymentProcessor_1.default.prototype, 'importToLocalchain');
        this.timeForTick = jest.spyOn(ArgonPaymentProcessor_1.default.prototype, 'timeForTick');
    }
    clear() {
        this.canSign.mockClear();
        this.importToLocalchain.mockClear();
        this.updateSettlement.mockClear();
        this.timeForTick.mockClear();
    }
    mock(onImport) {
        this.canSign.mockReturnValue(Promise.resolve(true));
        this.updateSettlement.mockResolvedValue(undefined);
        this.importToLocalchain.mockImplementation((datastoreId, channelHold) => {
            return onImport(datastoreId, channelHold);
        });
        this.timeForTick.mockImplementation((tick) => {
            const expiration = Date.now() + tick * 2000;
            return new Date(expiration);
        });
    }
}
exports.default = MockArgonPaymentProcessor;
//# sourceMappingURL=_MockArgonPaymentProcessor.js.map