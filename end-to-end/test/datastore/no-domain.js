"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
exports.default = new datastore_1.default({
    id: 'no-domain',
    version: '0.0.1',
    extractors: {
        nod: new datastore_1.Extractor({
            basePrice: 1000, // 1 milligon
            run(ctx) {
                ctx.Output.emit({ noDomain: true });
            },
        }),
    },
});
//# sourceMappingURL=no-domain.js.map