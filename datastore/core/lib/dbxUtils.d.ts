export declare function unpackDbx(compressedDbx: Buffer, toDirectory: string): Promise<void>;
export declare function packDbx(fromDirectory: string): Promise<Buffer>;
export declare function unpackDbxFile(file: string, toDirectory: string): Promise<void>;
