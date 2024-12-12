"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'cloneme',
    version: '0.0.1',
    name: 'cloneme',
    extractors: {
        cloneUpstream: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({ success: true, affiliateId: ctx.callerAffiliateId });
            },
            schema: {
                input: {
                    field: (0, schema_1.string)({ minLength: 1, description: 'a field you should use' }),
                    nested: (0, schema_1.object)({
                        fields: {
                            field2: (0, schema_1.boolean)(),
                        },
                        optional: true,
                    }),
                },
                output: {
                    success: (0, schema_1.boolean)(),
                    affiliateId: (0, schema_1.string)(),
                },
            },
        }),
    },
    tables: {
        users: new datastore_1.Table({
            schema: {
                name: (0, schema_1.string)(),
                birthdate: (0, schema_1.date)(),
            },
            onCreated() {
                return this.insertInternal({ name: 'me', birthdate: new Date() });
            },
        }),
        private: new datastore_1.Table({
            isPublic: false,
            schema: {
                secret: (0, schema_1.string)(),
                key: (0, schema_1.string)(),
            },
        }),
    },
});
//# sourceMappingURL=cloneme.js.map