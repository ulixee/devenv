"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CloudApiHandler_1 = require("../lib/CloudApiHandler");
exports.default = new CloudApiHandler_1.default('Cloud.status', {
    handler(_request, context) {
        const cloudNodes = context.nodeTracker.count;
        return Promise.resolve({ nodes: cloudNodes, version: context.version });
    },
});
//# sourceMappingURL=Cloud.status.js.map