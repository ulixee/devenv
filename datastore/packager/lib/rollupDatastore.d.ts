import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
interface IRollupEvents {
    change: {
        code: string;
        sourceMap: string;
    };
}
export default function rollupDatastore(scriptPath: string, options?: {
    tsconfig?: string;
    outDir?: string;
    dryRun?: boolean;
    watch?: boolean;
}): Promise<{
    code: string;
    sourceMap: string;
    modules: string[];
    events: TypedEventEmitter<IRollupEvents>;
    close: () => Promise<void>;
}>;
export {};
