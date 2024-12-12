export declare function build(path: string, options: {
    outDir?: string;
    tsconfig?: string;
    compiledSourcePath?: string;
}): Promise<void>;
export declare function deploy(entrypoint: string, options: {
    tsconfig?: string;
    compiledSourcePath?: string;
    cloudHost?: string;
    identityPath?: string;
    identityPassphrase?: string;
    dontAutoshowDocs?: boolean;
}): Promise<void>;
export declare function startDatastore(path: string, options: {
    outDir?: string;
    tsconfig?: string;
    compiledSourcePath?: string;
    watch?: boolean;
    showDocs?: boolean;
    extraArgs: string[];
}): Promise<void>;
