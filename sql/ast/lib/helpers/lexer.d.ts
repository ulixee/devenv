import { ISqlComment } from '../../interfaces/ISqlNode';
export declare const lexer: import("moo").Lexer;
export declare const lexerAny: any;
export declare function trackingComments<T>(act: () => T): {
    ast: T;
    comments: ISqlComment[];
};
export declare function tracking<T>(act: () => T): T;
export declare function track(xs: any, ret: any): any;
export declare function box(xs: any, value: any, dqSymbol?: boolean): any;
export declare function doubleQuoted(value: any): {
    doubleQuoted: boolean;
} | undefined;
export declare function unbox(value: any): any;
