"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@ulixee/schema");
const datastore_1 = require("@ulixee/datastore");
module.exports = new datastore_1.default({
    id: 'bootup',
    version: '0.0.1',
    extractors: {
        bootup: new datastore_1.Extractor({
            run({ Output }) {
                const output = new Output();
                output.success = true;
            },
            schema: {
                output: {
                    'is-valid': (0, schema_1.boolean)({ optional: true }),
                    success: (0, schema_1.boolean)(),
                },
            },
        }),
    },
});
//# sourceMappingURL=bootup.js.map