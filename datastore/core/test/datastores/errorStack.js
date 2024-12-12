"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const errors_1 = require("@ulixee/platform-utils/lib/errors");
exports.default = new datastore_1.Extractor({
    async run(ctx) {
        const y = await multiply(2);
        ctx.Output.emit({ y });
    },
});
const multiply = async (x) => {
    for (let i = 0; i <= 100; i += 1) {
        await new Promise(process.nextTick);
        x += i ** 2;
        if (i === 99)
            throw new errors_1.InvalidSignatureError('ERROR!!!');
    }
    return x;
};
//# sourceMappingURL=errorStack.js.map