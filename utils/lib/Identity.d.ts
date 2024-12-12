import { KeyObject } from 'crypto';
export default class Identity {
    #private;
    static defaultPkcsCipher: string;
    static encodingPrefix: "id";
    readonly privateKey: KeyObject;
    get bech32(): string;
    get publicKey(): Buffer;
    constructor(privateKey: KeyObject);
    sign(hashedMessage: Buffer): Buffer;
    equals(identityBech32: string): boolean;
    verifyKeys(): void;
    export(passphrase?: string, cipher?: string): string;
    toJSON(): string;
    toString(): string;
    save(filepath: string, options?: {
        passphrase?: string;
        cipher?: string;
    }): Promise<string>;
    static loadFromFile(filepath: string, options?: {
        relativeToPath?: string;
        keyPassphrase?: string;
    }): Identity;
    static loadFromPem(data: string, options?: {
        keyPassphrase?: string;
    }): Identity;
    static createSync(): Identity;
    static getBytes(encoded: string): Buffer;
    static create(): Promise<Identity>;
    static verify(identityBech32: string, hashedMessage: Buffer, signature: Buffer): boolean;
}
