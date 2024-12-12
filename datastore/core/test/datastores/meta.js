"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
class TestDatastore extends datastore_1.default {
    get metadata() {
        const meta = super.metadata;
        meta.coreVersion = '1.0.0';
        return meta;
    }
}
exports.default = new TestDatastore({});
//# sourceMappingURL=meta.js.map