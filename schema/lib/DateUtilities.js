"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtilities = void 0;
const node_assert_1 = require("node:assert");
const moment = require("moment");
const Units = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
class DateUtilities {
    constructor(config) {
        Object.assign(this, config);
        (0, node_assert_1.strict)(config.func === 'add' || config.func === 'subtract', 'func must be add or subtract');
        (0, node_assert_1.strict)(typeof config.quantity === 'number', 'quantity must be a number');
        (0, node_assert_1.strict)(Units.includes(config.units), `units must be one of ${Units.join(',')}`);
    }
    evaluate(format) {
        let result;
        if (this.func === 'add') {
            result = moment().add(this.quantity, this.units);
        }
        if (this.func === 'subtract') {
            result = moment().subtract(this.quantity, this.units);
        }
        if (format === 'date')
            return result.format('YYYY-MM-DD');
        if (format === 'time')
            return result.format('HH:mm');
        return result.toDate();
    }
}
exports.DateUtilities = DateUtilities;
//# sourceMappingURL=DateUtilities.js.map