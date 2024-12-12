"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
class ObjectSchema extends BaseSchema_1.default {
    constructor(config) {
        super(config);
        this.typeName = 'object';
        (0, node_assert_1.strict)(config.fields, 'You must configure the fields for this object');
        (0, node_assert_1.strict)(Object.keys(config.fields).length, 'You must configure one or more fields for this object');
        (0, node_assert_1.strict)(Object.values(config.fields).every(x => x && x instanceof BaseSchema_1.default), 'Each value of fields must be a type of Schema');
    }
    validationLogic(value, path, tracker) {
        if (value === null || value === undefined) {
            return this.incorrectType(value, path, tracker);
        }
        const fields = this.fields;
        const keysOfFields = Object.keys(fields);
        if (keysOfFields.length && typeof value !== 'object') {
            return this.incorrectType(value, path, tracker);
        }
        const keys = [...new Set([...keysOfFields, ...Object.keys(value)])];
        for (const key of keys) {
            const childPath = `${path}.${key}`;
            if (key in fields) {
                const schema = fields[key];
                if (!schema || !(schema instanceof BaseSchema_1.default))
                    continue;
                const keyValue = value[key];
                if (keyValue !== null && keyValue !== undefined) {
                    schema.validate(keyValue, childPath, tracker);
                }
                else if (!schema.optional) {
                    this.propertyMissing(schema, childPath, tracker);
                }
            }
        }
    }
}
exports.default = ObjectSchema;
//# sourceMappingURL=ObjectSchema.js.map