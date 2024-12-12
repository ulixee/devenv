"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
class BooleanSchema extends BaseSchema_1.default {
    constructor() {
        super(...arguments);
        this.typeName = 'boolean';
    }
    validationLogic(value, path, tracker) {
        if (typeof value !== this.typeName) {
            return this.incorrectType(value, path, tracker);
        }
    }
}
exports.default = BooleanSchema;
//# sourceMappingURL=BooleanSchema.js.map