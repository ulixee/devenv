"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesSetupSchema = void 0;
const zod_1 = require("zod");
exports.ServicesSetupSchema = zod_1.z.object({
    datastoreRegistryHost: zod_1.z.string().url().optional(),
    storageEngineHost: zod_1.z.string().url().optional(),
    statsTrackerHost: zod_1.z.string().url().optional(),
    nodeRegistryHost: zod_1.z.string().url().optional(),
    replayRegistryHost: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=IServicesSetup.js.map