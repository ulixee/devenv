export declare function wrapAsyncCall<Z, Fn extends keyof Z, T extends Z[Fn] extends (...args: any) => infer X ? X : never, Args extends Z[Fn] extends (...args: infer A) => any ? A : never>(owner: Z, name: Fn, ...args: Args): Promise<T>;
export declare function proxyWrapper<T>(proxyTarget: T): T;
