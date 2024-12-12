"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'remote-extractor',
    version: '0.0.1',
    extractors: {
        remote: new datastore_1.Extractor({
            run(ctx) {
                new ctx.Output({ iAmRemote: true, echo: ctx.input.test });
            },
            schema: {
                input: {
                    test: (0, schema_1.string)(),
                },
                output: {
                    iAmRemote: (0, schema_1.boolean)(),
                    echo: (0, schema_1.string)(),
                },
            },
        }),
    },
});
//# sourceMappingURL=remoteExtractor.js.map