"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'stream',
    extractors: {
        streamer: new datastore_1.Extractor(async (ctx) => {
            for (let i = 0; i < 3; i += 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                ctx.Output.emit({ record: i });
            }
        }),
    },
    tables: {
        streamTable: new datastore_1.Table({
            schema: {
                title: (0, schema_1.string)(),
                success: (0, schema_1.boolean)(),
            },
            async onCreated() {
                await this.insertInternal({ title: 'Hello', success: true }, { title: 'World', success: false });
            },
        }),
    },
});
//# sourceMappingURL=stream.js.map