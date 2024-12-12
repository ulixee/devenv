"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datastoreIdValidation = exports.datastoreRegex = void 0;
const zod_1 = require("zod");
exports.datastoreRegex = /[a-z0-9-]{2,50}/;
exports.datastoreIdValidation = zod_1.z
    .string()
    .min(2)
    .max(50)
    .regex(new RegExp(`^${exports.datastoreRegex.source}$`), 'This is not a valid datastoreId (2-20 lowercase alphanumeric characters).');
//# sourceMappingURL=datastoreIdValidation.js.map