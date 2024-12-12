"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'upload',
    extractors: {
        upTest: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({ upload: true });
            },
            schema: {
                output: { upload: (0, schema_1.boolean)({ description: 'Whether or not this test succeeded' }) },
            },
        }),
    },
});
//# sourceMappingURL=upload.js.map