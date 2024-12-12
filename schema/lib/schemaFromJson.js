"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = schemaFromJson;
const NumberSchema_1 = require("./NumberSchema");
const BigintSchema_1 = require("./BigintSchema");
const BooleanSchema_1 = require("./BooleanSchema");
const BufferSchema_1 = require("./BufferSchema");
const DateSchema_1 = require("./DateSchema");
const StringSchema_1 = require("./StringSchema");
const RecordSchema_1 = require("./RecordSchema");
const ArraySchema_1 = require("./ArraySchema");
const ObjectSchema_1 = require("./ObjectSchema");
function schemaFromJson(json) {
    if (!json)
        return undefined;
    if (json?.typeName && typeof json.typeName === 'string') {
        return parseField(json);
    }
    return parseObjectSchema(json);
}
function parseField(json) {
    const { typeName, element, fields, values, keys, ...config } = json;
    if (typeName === 'number')
        return new NumberSchema_1.default(config);
    if (typeName === 'bigint')
        return new BigintSchema_1.default(config);
    if (typeName === 'boolean')
        return new BooleanSchema_1.default(config);
    if (typeName === 'buffer')
        return new BufferSchema_1.default(config);
    if (typeName === 'date')
        return new DateSchema_1.default(config);
    if (typeName === 'string')
        return new StringSchema_1.default(config);
    if (typeName === 'record') {
        const recordConfig = {
            values: parseField(values),
            ...config,
        };
        if (keys)
            recordConfig.keys = new StringSchema_1.default(keys);
        return new RecordSchema_1.default(recordConfig);
    }
    if (typeName === 'array') {
        const elementConfig = parseField(element);
        return new ArraySchema_1.default({ element: elementConfig, ...config });
    }
    if (typeName === 'object') {
        return parseObjectSchema(fields, config);
    }
}
function parseObjectSchema(json, options = {}) {
    const fields = {};
    for (const [field, schemaJson] of Object.entries(json)) {
        fields[field] = parseField(schemaJson);
    }
    return new ObjectSchema_1.default({ fields, ...options });
}
//# sourceMappingURL=schemaFromJson.js.map