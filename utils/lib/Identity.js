"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Identity_bech32, _Identity_publicKeyBytes;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const crypto_1 = require("crypto");
const hashUtils_1 = require("@ulixee/commons/lib/hashUtils");
const fileUtils_1 = require("@ulixee/commons/lib/fileUtils");
const Logger_1 = require("@ulixee/commons/lib/Logger");
const bufferUtils_1 = require("@ulixee/commons/lib/bufferUtils");
const Ed25519_1 = require("./Ed25519");
const errors_1 = require("./errors");
const { log } = (0, Logger_1.default)(module);
class Identity {
    get bech32() {
        __classPrivateFieldSet(this, _Identity_bech32, __classPrivateFieldGet(this, _Identity_bech32, "f") ?? (0, bufferUtils_1.encodeBuffer)(this.publicKey, Identity.encodingPrefix), "f");
        return __classPrivateFieldGet(this, _Identity_bech32, "f");
    }
    get publicKey() {
        __classPrivateFieldSet(this, _Identity_publicKeyBytes, __classPrivateFieldGet(this, _Identity_publicKeyBytes, "f") ?? Ed25519_1.default.getPublicKeyBytes(this.privateKey), "f");
        return __classPrivateFieldGet(this, _Identity_publicKeyBytes, "f");
    }
    constructor(privateKey) {
        _Identity_bech32.set(this, void 0);
        _Identity_publicKeyBytes.set(this, void 0);
        if (!privateKey) {
            throw new errors_1.UnreadableIdentityError(`Cannot read private key`);
        }
        this.privateKey = privateKey;
    }
    sign(hashedMessage) {
        return Ed25519_1.default.sign(this.privateKey, hashedMessage);
    }
    equals(identityBech32) {
        return this.bech32 === identityBech32;
    }
    verifyKeys() {
        const hashedMessage = (0, hashUtils_1.sha256)(Buffer.from('signed_test_message'));
        const signature = this.sign(hashedMessage);
        const isValid = Identity.verify(this.bech32, hashedMessage, signature);
        if (!isValid) {
            throw new errors_1.UnreadableIdentityError('This Identity private key does not match the ED25519 spec');
        }
    }
    export(passphrase, cipher) {
        const options = {
            type: 'pkcs8',
            format: 'pem',
        };
        if (passphrase) {
            options.passphrase = passphrase;
            options.cipher = cipher ?? Identity.defaultPkcsCipher;
        }
        return this.privateKey.export(options);
    }
    toJSON() {
        return this.bech32;
    }
    toString() {
        return this.bech32;
    }
    async save(filepath, options) {
        if (filepath) {
            if (!path.isAbsolute(filepath)) {
                filepath = path.join(process.cwd(), filepath);
            }
            if (!(await (0, fileUtils_1.existsAsync)(path.dirname(filepath)))) {
                await fs_1.promises.mkdir(path.dirname(filepath), { recursive: true });
            }
        }
        if (!filepath)
            throw new Error('No valid filepath was provided');
        if ((0, fs_1.existsSync)(filepath)) {
            throw new Error('You attempted to overwrite an existing Identity!! Please remove it first.');
        }
        await fs_1.promises.writeFile(filepath, this.export(options?.passphrase, options?.cipher));
        return filepath;
    }
    // CLASS METHODS ////////////////////////
    static loadFromFile(filepath, options) {
        if (!path.isAbsolute(filepath)) {
            filepath = path.join(options?.relativeToPath ?? process.cwd(), filepath);
        }
        const data = (0, fs_1.readFileSync)(filepath, 'utf8');
        return Identity.loadFromPem(data, options);
    }
    static loadFromPem(data, options) {
        const privateKey = (0, crypto_1.createPrivateKey)({
            key: data,
            format: 'pem',
            type: 'pkcs8',
            passphrase: options?.keyPassphrase,
        });
        const identity = new Identity(privateKey);
        identity.verifyKeys();
        return identity;
    }
    static createSync() {
        const key = (0, crypto_1.generateKeyPairSync)('ed25519');
        const identity = new Identity(key.privateKey);
        identity.verifyKeys();
        return identity;
    }
    static getBytes(encoded) {
        return (0, bufferUtils_1.decodeBuffer)(encoded, Identity.encodingPrefix);
    }
    static async create() {
        const key = await Ed25519_1.default.create();
        const pair = new Identity(key.privateKey);
        pair.verifyKeys();
        return pair;
    }
    static verify(identityBech32, hashedMessage, signature) {
        if (!identityBech32)
            return false;
        const publicKeyBytes = Identity.getBytes(identityBech32);
        const publicKey = Ed25519_1.default.createPublicKeyFromBytes(publicKeyBytes);
        const isValid = Ed25519_1.default.verify(publicKey, hashedMessage, signature);
        if (isValid === true)
            return true;
        if (isValid instanceof Error) {
            log.error('Error validating signature', {
                error: isValid,
            });
        }
        return false;
    }
}
_Identity_bech32 = new WeakMap(), _Identity_publicKeyBytes = new WeakMap();
Identity.defaultPkcsCipher = 'aes-256-cbc';
Identity.encodingPrefix = 'id';
exports.default = Identity;
//# sourceMappingURL=Identity.js.map