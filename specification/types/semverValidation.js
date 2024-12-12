"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semverValidation = exports.semverRegex = void 0;
const zod_1 = require("zod");
exports.semverRegex = /(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)/;
exports.semverValidation = zod_1.z
    .string()
    .regex(new RegExp(`^${exports.semverRegex.source}$`))
    .describe('A semver');
//# sourceMappingURL=semverValidation.js.map