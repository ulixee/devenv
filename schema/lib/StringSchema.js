"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const url_1 = require("url");
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class StringSchema extends BaseSchema_1.default {
    constructor(config = {}) {
        super(config);
        this.typeName = 'string';
        if ((0, BaseSchema_1.isDefined)(this.format))
            (0, node_assert_1.strict)(['email', 'url', 'date', 'time'].includes(this.format), 'format must be one of email, url, date, time');
        if ((0, BaseSchema_1.isDefined)(this.regexp))
            (0, node_assert_1.strict)(this.regexp instanceof RegExp, 'regexp must be an instance of a regex');
        if ((0, BaseSchema_1.isDefined)(this.enum)) {
            (0, node_assert_1.strict)(Array.isArray(this.enum), 'enum must be an array of values');
            (0, node_assert_1.strict)(this.enum.every(x => typeof x === 'string'), 'enum must contain only strings');
        }
        if ((0, BaseSchema_1.isDefined)(config.minLength))
            (0, node_assert_1.strict)(typeof config.minLength === 'number', 'minLength value must be a number');
        if ((0, BaseSchema_1.isDefined)(config.maxLength))
            (0, node_assert_1.strict)(typeof config.maxLength === 'number', 'maxLength value must be a number');
        if ((0, BaseSchema_1.isDefined)(config.length))
            (0, node_assert_1.strict)(typeof config.length === 'number', 'length value must be a number');
    }
    toMoment(value) {
        if (this.format === 'date')
            return moment(value, StringSchema.DateFormat);
        if (this.format === 'time')
            return moment(value, StringSchema.TimeFormat);
        throw new Error('This StringSchema does not have a format of date or time.');
    }
    toDate(value) {
        return this.toMoment(value).toDate();
    }
    toFormat(date) {
        if (date instanceof Date) {
            date = moment(date);
        }
        if (this.format === 'time')
            return date.format(StringSchema.TimeFormat);
        if (this.format === 'date')
            return date.format(StringSchema.DateFormat);
        throw new Error('This StringSchema does not have a format of date or time.');
    }
    validationLogic(value, path, tracker) {
        if (typeof value !== this.typeName) {
            return this.incorrectType(value, path, tracker);
        }
        const config = this;
        if (config.format) {
            switch (config.format) {
                case 'date': {
                    if (!moment(value, StringSchema.DateFormat, true).isValid()) {
                        return this.failedConstraint(value, ` This value does not follow the YYYY-MM-DD date pattern`, path, tracker);
                    }
                    break;
                }
                case 'email': {
                    if (!regexpEmail.test(value)) {
                        return this.failedConstraint(value, ' This value is not a valid email', path, tracker);
                    }
                    break;
                }
                case 'time': {
                    if (!moment(value, StringSchema.TimeFormat, true).isValid()) {
                        return this.failedConstraint(value, ` This value does not follow the HH:mm time pattern`, path, tracker);
                    }
                    break;
                }
                case 'url': {
                    try {
                        new url_1.URL(value);
                    }
                    catch (err) {
                        return this.failedConstraint(value, ' This value is not a valid url', path, tracker);
                    }
                    break;
                }
            }
        }
        if (config.regexp && config.regexp instanceof RegExp && !config.regexp.test(value)) {
            return this.failedConstraint(value, ` This value does not match the field RegExp: /${config.regexp.source}/${config.regexp.flags}`, path, tracker);
        }
        if (config.minLength !== undefined && value.length < config.minLength) {
            return this.failedConstraint(value, ' This value is shorter than the minLength', path, tracker);
        }
        if (config.maxLength !== undefined && value.length > config.maxLength) {
            return this.failedConstraint(value, ' This value is shorter than the maxLength', path, tracker);
        }
        if (config.length !== undefined && value.length !== config.length) {
            return this.failedConstraint(value, ' This value is not the required length', path, tracker);
        }
        if (config.enum?.length && !config.enum.includes(value)) {
            return this.failedConstraint(value, ' This value does not match the allowed enum values', path, tracker);
        }
    }
}
StringSchema.DateFormat = 'YYYY-MM-DD';
StringSchema.TimeFormat = 'HH:mm';
exports.default = StringSchema;
// Taken from HTML spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const regexpEmail = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
//# sourceMappingURL=StringSchema.js.map