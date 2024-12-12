"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    extractors: {
        test: new datastore_1.Extractor({
            run(ctx) {
                ctx.Output.emit({
                    testerEcho: ctx.input.shouldTest,
                    greeting: 'Hello world',
                });
            },
            schema: {
                input: {
                    shouldTest: (0, schema_1.boolean)(),
                },
                output: {
                    testerEcho: (0, schema_1.boolean)(),
                    greeting: (0, schema_1.string)(),
                },
            },
        }),
    },
    tables: {
        testers: new datastore_1.Table({
            schema: {
                firstName: (0, schema_1.string)(),
                lastName: (0, schema_1.string)(),
                isTester: (0, schema_1.boolean)({ optional: true }),
            },
            onCreated() {
                return this.insertInternal({ firstName: 'Caleb', lastName: 'Clark', isTester: true }, { firstName: 'Blake', lastName: 'Byrnes' });
            }
        }),
    },
});
//# sourceMappingURL=fetch.js.map