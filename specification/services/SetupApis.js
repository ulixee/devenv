"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesSetupApiSchemas = void 0;
const zod_1 = require("zod");
const IServicesSetup_1 = require("../types/IServicesSetup");
exports.ServicesSetupApiSchemas = {
    'Services.getSetup': {
        args: zod_1.z.object({}).describe('Request default services setup from a node in the cluster.'),
        result: IServicesSetup_1.ServicesSetupSchema,
    },
};
//# sourceMappingURL=SetupApis.js.map