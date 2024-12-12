"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
const StringSchema_1 = require("./StringSchema");
class RecordSchema extends BaseSchema_1.default {
    constructor(config) {
        super(config);
        this.typeName = 'record';
        (0, node_assert_1.strict)(config.values, 'You must configure the types of values for this record');
        (0, node_assert_1.strict)(config.values instanceof BaseSchema_1.default, 'The values definition for this record must be a type of Schema');
        if (config.keys) {
            (0, node_assert_1.strict)(config.keys instanceof StringSchema_1.default, 'The definition for keys of this record must be a StringSchema');
        }
    }
    validationLogic(value, path, tracker) {
        if (value === null || value === undefined) {
            return this.incorrectType(value, path, tracker);
        }
        if (typeof value !== 'object') {
            return this.incorrectType(value, path, tracker);
        }
        for (const key of Object.keys(value)) {
            const childPath = `${path}.${key}`;
            if (this.keys)
                this.keys.validate(key, childPath, tracker);
            const schema = this.values;
            schema.validate(value[key], childPath, tracker);
        }
    }
}
exports.default = RecordSchema;
//# sourceMappingURL=RecordSchema.js.map