export default function cloneDatastore(url: string, directoryPath?: string, options?: {
    embedCredits?: {
        id: string;
        secret: string;
    };
    argonMainchainUrl?: string;
}): Promise<{
    datastoreFilePath: string;
}>;
