"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
exports.default = new datastore_1.default({
    id: 'output',
    extractors: {
        putout: new datastore_1.Extractor(ctx => {
            ctx.Output.emit({ success: true });
        }),
    },
});
//# sourceMappingURL=output.js.map