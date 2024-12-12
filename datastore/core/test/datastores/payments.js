"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'payments',
    extractors: {
        testPayments: new datastore_1.Extractor({
            run(ctx) {
                if (ctx.input.explode)
                    throw new Error('Explosive error');
                ctx.Output.emit({ success: true });
            },
            schema: {
                input: {
                    explode: (0, schema_1.boolean)({ optional: true }),
                },
                output: {
                    success: (0, schema_1.boolean)(),
                },
            },
        }),
    },
    tables: {
        successTitles: new datastore_1.Table({
            schema: {
                title: (0, schema_1.string)(),
                success: (0, schema_1.boolean)(),
            },
        }),
        titleNames: new datastore_1.Table({
            schema: {
                title: (0, schema_1.string)(),
                name: (0, schema_1.string)(),
            },
        }),
    },
    async onCreated() {
        await this.tables.successTitles.insertInternal({ title: 'Hello', success: true }, { title: 'World', success: false });
        await this.tables.titleNames.insertInternal({ title: 'Hello', name: 'Blake' }, { title: 'World', name: 'Caleb' });
    },
});
//# sourceMappingURL=payments.js.map