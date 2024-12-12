"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.Extractor({
    run(ctx) {
        ctx.Output.emit({ testerEcho: ctx.input.tester });
    },
    schema: {
        input: {
            tester: (0, schema_1.boolean)(),
        },
        output: {
            testerEcho: (0, schema_1.boolean)(),
        },
    },
});
//# sourceMappingURL=directExtractor.js.map