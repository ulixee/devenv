"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudSettingsSchema = void 0;
const zod_1 = require("zod");
exports.CloudSettingsSchema = zod_1.z.object({
    datastoreRegistryEndpoint: zod_1.z.string().url().optional(),
    storageEngineEndpoint: zod_1.z.string().url().optional(),
    statsEndpoint: zod_1.z.string().url().optional(),
    nodeRegistryEndpoint: zod_1.z.string().url().optional(),
    dhtServices: zod_1.z
        .object({
        datastoreRegistry: zod_1.z.any(),
        nodeRegistry: zod_1.z.any(),
    })
        .optional(),
});
//# sourceMappingURL=ICloudSettings.js.map