"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.Table({
    schema: {
        firstName: (0, schema_1.string)(),
        lastName: (0, schema_1.string)(),
        birthdate: (0, schema_1.date)({ optional: true }),
        commits: (0, schema_1.bigint)({ optional: true }),
    },
    async onCreated() {
        await this.insertInternal({ firstName: 'Caleb', lastName: 'Clark', birthdate: new Date('1982/09/30') }, { firstName: 'Blake', lastName: 'Byrnes', commits: 1n });
    },
});
//# sourceMappingURL=localTable.js.map