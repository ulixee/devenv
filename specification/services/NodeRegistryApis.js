"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRegistryApiSchemas = void 0;
const zod_1 = require("zod");
const types_1 = require("@ulixee/platform-specification/types");
const INodeInfo_1 = require("../types/INodeInfo");
const CloudNodeMetaSchema = INodeInfo_1.NodeInfoSchema.extend({
    isClusterNode: zod_1.z.boolean(),
    lastSeenDate: zod_1.z.date(),
});
exports.NodeRegistryApiSchemas = {
    'NodeRegistry.register': {
        args: CloudNodeMetaSchema.omit({
            lastSeenDate: true,
            isClusterNode: true,
        }),
        result: zod_1.z.object({
            nodes: CloudNodeMetaSchema.array().describe('Nodes connected to this host (for use boostrapping connection).'),
        }),
    },
    'NodeRegistry.getNodes': {
        args: zod_1.z.object({
            count: zod_1.z.number(),
        }),
        result: zod_1.z.object({
            nodes: CloudNodeMetaSchema.array(),
        }),
    },
    'NodeRegistry.health': {
        args: zod_1.z.object({
            nodeId: types_1.identityValidation.describe('Network identity of the node.'),
            coreMetrics: zod_1.z.object({
                datastoreQueries: zod_1.z.number().describe('Queries since last run-time.'),
                heroSessions: zod_1.z.number().describe('Hero sessions created since last run-time.'),
                heroPoolSize: zod_1.z.number().describe('Hero pool size.'),
                heroPoolAvailable: zod_1.z.number().describe('Hero pool available slots.'),
                periodStartTime: zod_1.z.date().describe('The start date of these metrics.'),
            }),
            clientConnections: zod_1.z.number().describe('Clients currently connected to the public api.'),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
};
//# sourceMappingURL=NodeRegistryApis.js.map