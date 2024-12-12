"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeSerializer_1 = require("@ulixee/commons/lib/TypeSerializer");
class SqliteAdapter {
    toEngineType(type) {
        const schemaToSqliteTypes = {
            string: 'TEXT',
            number: 'INTEGER',
            boolean: 'INTEGER',
            bigint: 'INTEGER',
            buffer: 'BLOB',
            date: 'TEXT',
            record: 'BLOB',
            object: 'BLOB',
            array: 'BLOB',
        };
        return schemaToSqliteTypes[type];
    }
    fromEngineValue(type, value) {
        if (value === null || value === undefined) {
            return null;
        }
        if (type === 'boolean') {
            return !!value;
        }
        if (type === 'buffer') {
            return value;
        }
        if (type === 'bigint') {
            return value ? BigInt(value) : null;
        }
        if (type === 'date') {
            return value ? new Date(value) : null;
        }
        if (['record', 'object', 'array'].includes(type)) {
            return value ? TypeSerializer_1.default.parse(value) : null;
        }
        return value;
    }
    toEngineValue(type, value) {
        if (value === undefined || value === null)
            return [null];
        if (type === 'boolean') {
            return [value ? 1 : 0];
        }
        if (type === 'date') {
            return [value ? value.toISOString() : null];
        }
        if (['record', 'object', 'array'].includes(type)) {
            return [value ? TypeSerializer_1.default.stringify(value, { sortKeys: true }) : null];
        }
        if (type === undefined || type === null) {
            if (Buffer.isBuffer(value)) {
                return [value, 'buffer'];
            }
            if (typeof value === 'bigint') {
                return [value, 'bigint'];
            }
            if (typeof value === 'boolean') {
                return [value ? 1 : 0, 'boolean'];
            }
            if (value && value instanceof Date) {
                return [value.toISOString(), 'date'];
            }
            if (value && typeof value === 'object') {
                return [value ? TypeSerializer_1.default.stringify(value, { sortKeys: true }) : null, 'object'];
            }
        }
        return [value];
    }
}
exports.default = SqliteAdapter;
//# sourceMappingURL=SqliteAdapter.js.map