"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtilities = exports.ObjectSchema = exports.ArraySchema = void 0;
exports.boolean = boolean;
exports.number = number;
exports.string = string;
exports.bigint = bigint;
exports.buffer = buffer;
exports.date = date;
exports.dateAdd = dateAdd;
exports.dateSubtract = dateSubtract;
exports.record = record;
exports.object = object;
exports.array = array;
const BaseSchema_1 = require("./lib/BaseSchema");
const NumberSchema_1 = require("./lib/NumberSchema");
const StringSchema_1 = require("./lib/StringSchema");
const BigintSchema_1 = require("./lib/BigintSchema");
const ObjectSchema_1 = require("./lib/ObjectSchema");
exports.ObjectSchema = ObjectSchema_1.default;
const ArraySchema_1 = require("./lib/ArraySchema");
exports.ArraySchema = ArraySchema_1.default;
const BooleanSchema_1 = require("./lib/BooleanSchema");
const BufferSchema_1 = require("./lib/BufferSchema");
const DateSchema_1 = require("./lib/DateSchema");
const RecordSchema_1 = require("./lib/RecordSchema");
const DateUtilities_1 = require("./lib/DateUtilities");
Object.defineProperty(exports, "DateUtilities", { enumerable: true, get: function () { return DateUtilities_1.DateUtilities; } });
function boolean(config = {}) {
    return new BooleanSchema_1.default(config);
}
function number(config = {}) {
    return new NumberSchema_1.default(config);
}
function string(config = {}) {
    return new StringSchema_1.default(config);
}
function bigint(config = {}) {
    return new BigintSchema_1.default(config);
}
function buffer(config = {}) {
    return new BufferSchema_1.default(config);
}
function date(config = {}) {
    return new DateSchema_1.default(config);
}
function dateAdd(quantity, units) {
    return new DateUtilities_1.DateUtilities({ func: 'add', units, quantity });
}
function dateSubtract(quantity, units) {
    return new DateUtilities_1.DateUtilities({ func: 'subtract', units, quantity });
}
function record(config) {
    return new RecordSchema_1.default(config);
}
function object(fieldsOrConfig) {
    if (!fieldsOrConfig.fields ||
        typeof fieldsOrConfig.fields !== 'object' ||
        !(Object.values(fieldsOrConfig.fields)[0] instanceof BaseSchema_1.default)) {
        fieldsOrConfig = { fields: fieldsOrConfig };
    }
    return new ObjectSchema_1.default(fieldsOrConfig);
}
function array(elementOrConfig) {
    if (elementOrConfig instanceof BaseSchema_1.default) {
        elementOrConfig = { element: elementOrConfig };
    }
    return new ArraySchema_1.default(elementOrConfig);
}
//# sourceMappingURL=index.js.map