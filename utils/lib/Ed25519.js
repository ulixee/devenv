"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const util_1 = require("util");
const ed25519DerPrefix = Buffer.from('302a300506032b6570032100', 'hex');
const ed25519PrivateDerPrefix = Buffer.from('302e020100300506032b657004220420', 'hex');
const generateKeyPairAsync = (0, util_1.promisify)(crypto_1.generateKeyPair);
class Ed25519 {
    static getPublicKeyBytes(privateKey) {
        return (0, crypto_1.createPublicKey)(privateKey)
            .export({ type: 'spki', format: 'der' })
            .slice(ed25519DerPrefix.length);
    }
    static getPrivateKeyBytes(key) {
        return key.export({ type: 'pkcs8', format: 'der' }).slice(ed25519PrivateDerPrefix.length);
    }
    static createPublicKeyFromBytes(bytes) {
        if (bytes.length !== 32) {
            throw new Error(`Wrong key length (${bytes.length}) provided to createPublicKeyFromBytes. Must be 32 bytes (20 hex chars)`);
        }
        const keyDer = Buffer.concat([ed25519DerPrefix, bytes]);
        return (0, crypto_1.createPublicKey)({ key: keyDer, format: 'der', type: 'spki' });
    }
    static createPrivateKeyFromBytes(bytes) {
        if (bytes.length !== 32) {
            throw new Error(`Wrong key length (${bytes.length}) provided to importPublicKey. Must be 32 bytes (20 hex chars)`);
        }
        const keyDer = Buffer.concat([ed25519PrivateDerPrefix, bytes]);
        return (0, crypto_1.createPrivateKey)({ key: keyDer, format: 'der', type: 'pkcs8' });
    }
    static async create() {
        return await generateKeyPairAsync('ed25519');
    }
    static verify(publicKey, hashedMessage, signature) {
        if (!signature || !signature.length || !hashedMessage || !hashedMessage.length || !publicKey)
            return false;
        try {
            return (0, crypto_1.verify)(null, hashedMessage, publicKey, signature);
        }
        catch (e) {
            return e;
        }
    }
    static sign(keyObject, hashedMessage) {
        if (hashedMessage.byteLength !== 32)
            throw new Error('Attempting to sign a non 256 bit value. Only provide hashed values to sign!!');
        return (0, crypto_1.sign)(null, hashedMessage, keyObject);
    }
}
exports.default = Ed25519;
//# sourceMappingURL=Ed25519.js.map