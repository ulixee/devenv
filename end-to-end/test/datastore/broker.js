"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
exports.default = new datastore_1.default({
    id: 'broker',
    version: '0.0.1',
    extractors: {
        default: new datastore_1.Extractor({
            basePrice: 50_000, // ~5 cents
            run(ctx) {
                ctx.Output.emit({ success: true, input: ctx.input });
            },
        }),
    },
});
//# sourceMappingURL=broker.js.map