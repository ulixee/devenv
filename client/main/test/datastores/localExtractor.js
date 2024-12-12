"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.Extractor({
    name: 'test',
    run(ctx) {
        ctx.Output.emit({
            testerEcho: ctx.input.shouldTest,
            lastName: 'Clark',
            greeting: 'Hello world',
        });
    },
    schema: {
        input: {
            shouldTest: (0, schema_1.boolean)(),
        },
        output: {
            testerEcho: (0, schema_1.boolean)(),
            lastName: (0, schema_1.string)(),
            greeting: (0, schema_1.string)(),
        },
    },
});
//# sourceMappingURL=localExtractor.js.map