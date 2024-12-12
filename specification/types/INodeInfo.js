"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeInfoSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("@ulixee/platform-specification/types");
exports.NodeInfoSchema = zod_1.z.object({
    nodeId: types_1.identityValidation.describe('Network identity of the node.'),
    apiHost: zod_1.z.string().describe('IpOrDomain:port where Ulixee APIs are reachable.'),
});
//# sourceMappingURL=INodeInfo.js.map