"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayRegistryApiSchemas = void 0;
const zod_1 = require("zod");
exports.ReplayRegistryApiSchemas = {
    'ReplayRegistry.store': {
        args: zod_1.z.object({
            sessionId: zod_1.z.string().describe('The session id of this Hero Replay session.'),
            timestamp: zod_1.z.number().describe('Unix millis since epoch.'),
            db: zod_1.z.instanceof(Buffer).describe('The compressed raw bytes of the database.'),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
    'ReplayRegistry.delete': {
        args: zod_1.z.object({
            sessionId: zod_1.z.string(),
        }),
        result: zod_1.z.object({
            success: zod_1.z.boolean(),
        }),
    },
    'ReplayRegistry.get': {
        args: zod_1.z.object({
            sessionId: zod_1.z.string(),
        }),
        result: zod_1.z.object({
            db: zod_1.z.instanceof(Buffer).describe('Compressed raw bytes of the database.'),
        }),
    },
    'ReplayRegistry.ids': {
        args: zod_1.z.object({}),
        result: zod_1.z.object({
            sessionIds: zod_1.z.string().array(),
        }),
    },
};
//# sourceMappingURL=ReplayRegistryApis.js.map