"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@ulixee/datastore");
const errorStack_1 = require("./errorStack");
exports.default = new datastore_1.default({
    id: 'error-stack',
    version: '0.0.1',
    extractors: {
        errorStack: errorStack_1.default,
    },
});
//# sourceMappingURL=errorStackDatastore.js.map