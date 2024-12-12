"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'remote-table',
    version: '0.0.1',
    tables: {
        remote: new datastore_1.Table({
            schema: {
                title: (0, schema_1.string)(),
                success: (0, schema_1.boolean)(),
            },
        }),
    },
    async onCreated() {
        await this.tables.remote.insertInternal({ title: 'Hello', success: true }, { title: 'World', success: false });
    },
});
//# sourceMappingURL=remoteTable.js.map