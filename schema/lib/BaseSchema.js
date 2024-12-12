"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = isDefined;
const node_assert_1 = require("node:assert");
class BaseSchema {
    constructor(config) {
        if (config) {
            if (isDefined(config.description)) {
                (0, node_assert_1.strict)(typeof config.description === 'string', 'description must be a string');
            }
            if (isDefined(config.optional)) {
                (0, node_assert_1.strict)(typeof config.optional === 'boolean', 'optional must be a boolean');
            }
            for (const [key, value] of Object.entries(config)) {
                if (key === 'optional' && value === false)
                    continue;
                this[key] = value;
            }
        }
    }
    validate(value, path = '', validationTracker = ValidationTracker()) {
        if (!validationTracker.has(value, this)) {
            this.validationLogic(value, path, validationTracker);
        }
        return {
            success: !validationTracker.errors.length,
            errors: validationTracker.errors,
        };
    }
    incorrectType(value, path, tracker) {
        let actualType = typeof value;
        if (actualType === 'object') {
            if (value === null)
                actualType = 'null';
            if (Array.isArray(value))
                actualType = 'array';
            if (value.constructor?.name !== 'Object')
                actualType = value.constructor?.name;
        }
        tracker.errors.push({
            path,
            code: 'invalidType',
            message: `Expected ${BaseSchema.inspect(this)}, but was ${actualType}`,
        });
    }
    failedConstraint(value, message, path, tracker) {
        const info = message ? `: ${message}` : '';
        tracker.errors.push({
            path,
            code: 'constraintFailed',
            message: `Failed constraint check for ${BaseSchema.inspect(this)}${info}`,
        });
    }
    propertyMissing(property, path, tracker) {
        tracker.errors.push({
            path,
            code: 'missing',
            message: `Expected ${BaseSchema.inspect(property, undefined)}, but was missing`,
        });
    }
    static inspect(schema, needsParens = false, circular = new Set()) {
        if (circular.has(schema)) {
            let s = `CIRCULAR ${schema.typeName}`;
            if (needsParens)
                s = `(${s})`;
            return s;
        }
        circular.add(schema);
        try {
            switch (schema.typeName) {
                case 'boolean':
                case 'number':
                case 'bigint':
                case 'buffer':
                case 'date':
                case 'string': {
                    return schema.typeName;
                }
                case 'array':
                    return `Array<${BaseSchema.inspect(schema.element, true, circular)}>`;
                case 'record':
                    return `{ keys: ${BaseSchema.inspect(schema.keys, true, circular)}, values: ${BaseSchema.inspect(schema.values, true, circular)} }`;
                case 'object': {
                    let returnType = '{';
                    let isFirst = true;
                    for (const [key, field] of Object.entries(schema.fields)) {
                        if (!isFirst)
                            returnType += ',';
                        const optional = field.optional;
                        const nested = BaseSchema.inspect(field, false, circular);
                        returnType += ` ${key}${optional ? '?' : ''}: ${nested}`;
                        isFirst = false;
                    }
                    return `${returnType} }`;
                }
            }
        }
        finally {
            circular.delete(schema);
        }
    }
}
exports.default = BaseSchema;
function isDefined(value) {
    return !(value === null || value === undefined);
}
function ValidationTracker() {
    const members = new WeakMap();
    return {
        errors: [],
        has(candidate, type) {
            let typeSet = members.get(candidate);
            const value = typeSet?.get(type) ?? false;
            if (candidate !== null && typeof candidate === 'object') {
                if (!typeSet) {
                    typeSet = new WeakMap();
                    members.set(candidate, typeSet);
                }
                typeSet.set(type, true);
            }
            return value;
        },
    };
}
//# sourceMappingURL=BaseSchema.js.map