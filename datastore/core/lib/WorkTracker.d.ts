export default class WorkTracker {
    maxRuntimeMs: number;
    private runPromises;
    private uploadPromises;
    constructor(maxRuntimeMs: number);
    stop(waitForDatastoreCompletionOnShutdown: boolean): Promise<void>;
    trackUpload<T>(uploadPromise: Promise<T>): Promise<T>;
    trackRun<TOutput>(outputPromise: Promise<TOutput>): Promise<TOutput>;
}
