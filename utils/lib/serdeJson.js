"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = serdeJson;
function serdeJson(toSerialize) {
    return JSON.stringify(toSerialize, (_name, value) => {
        if (value instanceof Uint8Array) {
            return `0x${Buffer.from(value).toString('hex')}`;
        }
        if (Buffer.isBuffer(value)) {
            return `0x${value.toString('hex')}`;
        }
        // translate the pre-parsed Buffer to a hex string
        if (value && typeof value === 'object' && 'type' in value && 'data' in value) {
            const bufferLike = value;
            if (bufferLike.type === 'Buffer') {
                return `0x${Buffer.from(bufferLike.data).toString('hex')}`;
            }
        }
        if (typeof value === 'bigint') {
            if (value > Number.MAX_SAFE_INTEGER) {
                return value.toString();
            }
            return Number(value);
        }
        return value;
    });
}
//# sourceMappingURL=serdeJson.js.map