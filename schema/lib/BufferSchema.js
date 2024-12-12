"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const BaseSchema_1 = require("./BaseSchema");
const IBufferEncodingTypes = [
    'ascii',
    'utf8',
    'utf16le',
    'ucs2',
    'base64',
    'latin1',
    'binary',
    'hex',
];
class BufferSchema extends BaseSchema_1.default {
    constructor(config) {
        super(config);
        this.typeName = 'buffer';
        if ((0, BaseSchema_1.isDefined)(config.encoding))
            (0, node_assert_1.strict)(!IBufferEncodingTypes.includes(config.encoding), `encoding must be one of ${IBufferEncodingTypes.join(', ')}`);
    }
    validationLogic(value, path, tracker) {
        if (!Buffer.isBuffer(value)) {
            return this.incorrectType(value, path, tracker);
        }
    }
}
exports.default = BufferSchema;
//# sourceMappingURL=BufferSchema.js.map