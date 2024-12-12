"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ed25519_1 = require("../lib/Ed25519");
test('can create and restore public ed25519 key bytes', async () => {
    const keys = await Ed25519_1.default.create();
    const publicKeyBytes = Ed25519_1.default.getPublicKeyBytes(keys.privateKey);
    expect(keys.publicKey).toEqual(Ed25519_1.default.createPublicKeyFromBytes(publicKeyBytes));
});
test('can create and restore private ed25519 key bytes', async () => {
    const keys = await Ed25519_1.default.create();
    const privateKeyBytes = Ed25519_1.default.getPrivateKeyBytes(keys.privateKey);
    const privateKeyString = keys.privateKey.export({ format: 'der', type: 'pkcs8' }).toString('hex');
    const recreatedPk = Ed25519_1.default.createPrivateKeyFromBytes(privateKeyBytes);
    expect(recreatedPk.export({ format: 'der', type: 'pkcs8' }).toString('hex')).toBe(privateKeyString);
    expect(Ed25519_1.default.getPrivateKeyBytes(recreatedPk)).toEqual(privateKeyBytes);
});
//# sourceMappingURL=Ed25519.test.js.map