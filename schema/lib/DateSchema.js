"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class DateSchema extends BaseSchema_1.default {
    constructor(config = {}) {
        super(config);
        this.typeName = 'date';
        if ((0, BaseSchema_1.isDefined)(config.future))
            (0, node_assert_1.strict)(typeof config.future === 'boolean', 'future must be a boolean');
        if ((0, BaseSchema_1.isDefined)(config.past))
            (0, node_assert_1.strict)(typeof config.past === 'boolean', 'past must be a boolean');
        (0, node_assert_1.strict)(!(config.past && config.future), "can't be both past and future");
    }
    validationLogic(value, path, tracker) {
        const mDate = moment(value);
        if (!mDate.isValid()) {
            return this.incorrectType(value, path, tracker);
        }
        const config = this;
        if (config.future && !mDate.isAfter(new Date())) {
            return this.failedConstraint(value, ' Value is not a date in the future.', path, tracker);
        }
        if (config.past && !mDate.isBefore(new Date())) {
            return this.failedConstraint(value, ' Value is not a date in the past.', path, tracker);
        }
    }
}
exports.default = DateSchema;
//# sourceMappingURL=DateSchema.js.map