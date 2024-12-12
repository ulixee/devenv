"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.Table({
    name: 'testing',
    schema: {
        title: (0, schema_1.string)(),
        success: (0, schema_1.boolean)(),
    },
    async onCreated() {
        await this.insertInternal({ title: 'Hello', success: true }, { title: 'World', success: false });
    },
});
//# sourceMappingURL=directTable.js.map