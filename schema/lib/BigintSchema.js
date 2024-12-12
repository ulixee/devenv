"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class BigintSchema extends BaseSchema_1.default {
    constructor(config = {}) {
        super(config);
        this.typeName = 'bigint';
        if ((0, BaseSchema_1.isDefined)(config.min))
            (0, node_assert_1.strict)(typeof config.min === 'bigint', 'Min value must be a bigint');
        if ((0, BaseSchema_1.isDefined)(config.max))
            (0, node_assert_1.strict)(typeof config.max === 'bigint', 'Max value must be a bigint');
    }
    validationLogic(value, path, tracker) {
        if (typeof value !== this.typeName) {
            return this.incorrectType(value, path, tracker);
        }
        const config = this;
        if (config.max !== undefined && config.min !== null && value < config.min) {
            return this.failedConstraint(value, ' This value is smaller than the min.', path, tracker);
        }
        if (config.max !== undefined && config.max !== null && value > config.max) {
            return this.failedConstraint(value, ' This value is larger than the max.', path, tracker);
        }
    }
}
exports.default = BigintSchema;
//# sourceMappingURL=BigintSchema.js.map