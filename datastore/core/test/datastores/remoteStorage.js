"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const schema_1 = require("@ulixee/schema");
exports.default = new datastore_1.default({
    id: 'remote-storage',
    version: '0.0.1',
    tables: {
        intro: new datastore_1.Table({
            schema: {
                title: (0, schema_1.string)(),
                visible: (0, schema_1.boolean)(),
            },
        }),
    },
    async onCreated() {
        await this.tables.intro.insertInternal({ title: 'Hello', visible: true }, { title: 'World', visible: false });
    },
});
//# sourceMappingURL=remoteStorage.js.map