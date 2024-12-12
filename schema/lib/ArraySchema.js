"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class ArraySchema extends BaseSchema_1.default {
    constructor(config) {
        super(config);
        this.typeName = 'array';
        (0, node_assert_1.strict)(!!config.element, 'You must provide a definition for the types of elements in this array');
        (0, node_assert_1.strict)(config.element instanceof BaseSchema_1.default, 'Element must be an instance of a type of Schema');
    }
    validationLogic(value, path, tracker) {
        if (!Array.isArray(value)) {
            return this.incorrectType(value, path, tracker);
        }
        for (let i = 0; i < value.length; i += 1) {
            this.element.validate(value[i], `${path}.${i}`, tracker);
        }
    }
}
exports.default = ArraySchema;
//# sourceMappingURL=ArraySchema.js.map