"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudApiSchemas = void 0;
const zod_1 = require("zod");
exports.CloudApiSchemas = {
    'Cloud.status': {
        args: zod_1.z.object({}),
        result: zod_1.z.object({
            version: zod_1.z.string({ description: 'The version of Ulixee.' }),
            nodes: zod_1.z.number().describe('Number of known nodes.'),
        }),
    },
};
//# sourceMappingURL=CloudApis.js.map