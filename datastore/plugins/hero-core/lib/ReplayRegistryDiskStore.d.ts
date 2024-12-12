import { IReplayRegistryApiTypes } from '@ulixee/platform-specification/services/ReplayRegistryApis';
export default class ReplayRegistryDiskStore {
    readonly storageDir: string;
    constructor(storageDir: string);
    get(sessionId: string): Promise<IReplayRegistryApiTypes['ReplayRegistry.get']['result']>;
    delete(sessionId: string): Promise<IReplayRegistryApiTypes['ReplayRegistry.delete']['result']>;
    store(sessionId: string, db: Buffer): Promise<IReplayRegistryApiTypes['ReplayRegistry.store']['result']>;
    ids(): Promise<IReplayRegistryApiTypes['ReplayRegistry.ids']['result']>;
    static getCompressedDb(path: string): Promise<Buffer>;
}
