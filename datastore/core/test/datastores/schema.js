"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'schema',
    version: '0.0.1',
    extractors: {
        default: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({ success: true });
            },
            schema: {
                input: {
                    field: (0, schema_1.string)({ minLength: 1, description: 'a field you should use' }),
                },
                output: {
                    success: (0, schema_1.boolean)(),
                },
            },
        }),
    },
});
//# sourceMappingURL=schema.js.map