"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const moment = require("moment");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'moment',
    version: '0.0.1',
    extractors: {
        moment: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({ date: moment(ctx.input.date).toDate() });
            },
            schema: {
                input: {
                    date: (0, schema_1.string)({ format: 'date' }),
                },
                output: {
                    date: (0, schema_1.date)(),
                },
            },
        }),
    },
});
//# sourceMappingURL=moment.js.map