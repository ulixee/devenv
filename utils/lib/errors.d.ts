import { UlixeeError } from '@ulixee/commons/lib/errors';
export declare class InvalidSignatureError extends UlixeeError {
    readonly details: {};
    constructor(message: any, details?: {});
}
export declare class UnreadableIdentityError extends UlixeeError {
    constructor(message: any);
}
export declare class InvalidIdentityError extends UlixeeError {
    constructor(message: any);
}
