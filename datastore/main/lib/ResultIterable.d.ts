export default class ResultIterable<T, TMeta = any> implements AsyncIterable<T>, Promise<T[]> {
    private onComplete?;
    error?: Error;
    results: T[];
    get resultMetadata(): Promise<TMeta>;
    private resolvable;
    private _resultMetadata;
    private readonly pullQueue;
    private readonly pushQueue;
    get [Symbol.toStringTag](): string;
    constructor(onComplete?: () => void);
    push(value: T, index?: number): void;
    done(resultMetadata?: TMeta): void;
    reject(error: Error, resultMetadata?: TMeta): void;
    then<TResult1 = T[], TResult2 = never>(onfulfilled?: ((value: T[]) => PromiseLike<TResult1> | TResult1) | undefined | null, onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null): Promise<T[] | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T[]>;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    private iteratorResultReturn;
    private iteratorResultThrow;
    private iteratorResultNext;
}
