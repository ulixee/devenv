import { KeyObject, KeyPairKeyObjectResult } from 'crypto';
export default class Ed25519 {
    static getPublicKeyBytes(privateKey: KeyObject): Buffer;
    static getPrivateKeyBytes(key: KeyObject): Buffer;
    static createPublicKeyFromBytes(bytes: Buffer): KeyObject;
    static createPrivateKeyFromBytes(bytes: Buffer): KeyObject;
    static create(): Promise<KeyPairKeyObjectResult>;
    static verify(publicKey: KeyObject, hashedMessage: Buffer, signature: Buffer): Error | boolean;
    static sign(keyObject: KeyObject, hashedMessage: Buffer): Buffer;
}
