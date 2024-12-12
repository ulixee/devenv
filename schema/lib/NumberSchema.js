"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class NumberSchema extends BaseSchema_1.default {
    constructor(config = {}) {
        super(config);
        this.typeName = 'number';
        if ((0, BaseSchema_1.isDefined)(config.min))
            (0, node_assert_1.strict)(typeof config.min === 'number', 'Min value must be a number');
        if ((0, BaseSchema_1.isDefined)(config.max))
            (0, node_assert_1.strict)(typeof config.max === 'number', 'Max value must be a number');
        if ((0, BaseSchema_1.isDefined)(config.decimals)) {
            (0, node_assert_1.strict)(typeof config.decimals === 'number', 'number of required decimals must be a number');
        }
        if ((0, BaseSchema_1.isDefined)(config.integer)) {
            (0, node_assert_1.strict)(typeof config.integer === 'boolean', 'integer must be a boolean');
        }
    }
    validationLogic(value, path, tracker) {
        if (typeof value !== this.typeName) {
            return this.incorrectType(value, path, tracker);
        }
        const config = this;
        if (config.min !== undefined && config.min !== null && value < config.min) {
            return this.failedConstraint(value, ' This value is smaller than the min.', path, tracker);
        }
        if (config.max !== undefined && config.max !== null && value > config.max) {
            return this.failedConstraint(value, ' This value is larger than the max.', path, tracker);
        }
        if (config.integer === true && !Number.isInteger(value)) {
            return this.failedConstraint(value, ' This value is not an integer.', path, tracker);
        }
        if (config.decimals !== undefined && Number.isInteger(config.decimals)) {
            const decimals = String(value).split('.')[1]?.length ?? 0;
            if (decimals !== config.decimals) {
                return this.failedConstraint(value, ` This value has an invalid number of decimal places (${decimals})`, path, tracker);
            }
        }
    }
}
exports.default = NumberSchema;
//# sourceMappingURL=NumberSchema.js.map