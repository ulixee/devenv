"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microgonsValidation = exports.multiSignatureValidation = exports.hashValidation = exports.identitySignatureValidation = exports.identityValidation = exports.addressValidation = void 0;
exports.bufferPreprocess = bufferPreprocess;
const zod_1 = require("zod");
exports.addressValidation = zod_1.z
    .string()
    .length(48)
    .regex(/^[1-9A-HJ-NP-Za-km-z]+$/); // base 58
exports.identityValidation = zod_1.z
    .string()
    .length(61)
    .regex(/^id1[ac-hj-np-z02-9]{58}$/, 'This is not a Ulixee identity (Bech32m encoded public key starting with "id1").');
exports.identitySignatureValidation = zod_1.z.instanceof(Buffer).refine(x => x.length === 64, {
    message: 'Signatures must be 64 bytes',
});
exports.hashValidation = zod_1.z.preprocess(x => bufferPreprocess(x), zod_1.z.instanceof(Buffer).refine(x => x.length === 32, { message: 'Hashes must be 32 bytes' }));
exports.multiSignatureValidation = zod_1.z.preprocess(x => bufferPreprocess(x), zod_1.z.instanceof(Buffer).refine(x => x.length === 65 || x.length === 66, {
    message: 'Signatures must be 64 or 65 bytes, and must have a byte for the encoded type of signature',
}));
exports.microgonsValidation = zod_1.z.preprocess(x => {
    if (typeof x === 'string') {
        if (x.endsWith('n'))
            x = x.slice(0, -1);
        return BigInt(x);
    }
    if (typeof x === 'number')
        return BigInt(x);
    return x;
}, zod_1.z.bigint().gte(0n));
function bufferPreprocess(x) {
    if (typeof x === 'string') {
        if (x.startsWith('0x'))
            x = x.slice(2);
        return Buffer.from(x, 'hex');
    }
    if (x instanceof Uint8Array)
        return Buffer.from(x);
    return x;
}
//# sourceMappingURL=index.js.map