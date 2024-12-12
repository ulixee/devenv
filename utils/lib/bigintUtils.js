"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.min = min;
exports.max = max;
exports.bigintRound = bigintRound;
function min(a, b) {
    return a < b ? a : b;
}
function max(a, b) {
    return a > b ? a : b;
}
function bigintRound(value, precision) {
    const factor = BigInt(10) ** BigInt(precision);
    return (value + factor / BigInt(2)) / factor;
}
//# sourceMappingURL=bigintUtils.js.map