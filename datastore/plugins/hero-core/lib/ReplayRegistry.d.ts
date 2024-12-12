import TypedEventEmitter from '@ulixee/commons/lib/TypedEventEmitter';
import SessionDb from '@ulixee/hero-core/dbs/SessionDb';
import ISessionRegistry from '@ulixee/hero-core/interfaces/ISessionRegistry';
import { ConnectionToCore } from '@ulixee/net';
import { IReplayRegistryApis } from '@ulixee/platform-specification/services/ReplayRegistryApis';
import ReplayRegistryDiskStore from './ReplayRegistryDiskStore';
export default class ReplayRegistry extends TypedEventEmitter<{
    new: {
        sessionId: string;
        dbPath: string;
    };
}> implements ISessionRegistry {
    private config;
    get defaultDir(): string;
    readonly replayStorageRegistry?: ReplayRegistryDiskStore;
    private readonly serviceClient?;
    private readonly storePromises;
    private defaultSessionRegistry;
    constructor(config: {
        serviceClient?: ConnectionToCore<IReplayRegistryApis, {}>;
        queryHeroStorageDir: string;
        defaultHeroStorageDir: string;
    });
    shutdown(): Promise<void>;
    flush(): Promise<void>;
    create(sessionId: string, customPath?: string): SessionDb;
    retain(sessionId: string, customPath?: string): Promise<SessionDb>;
    get(sessionId: string, customPath?: string): Promise<SessionDb>;
    ids(): Promise<string[]>;
    close(sessionId: string, isDeleteRequested: boolean): Promise<void>;
    delete(sessionId: string): Promise<void>;
    store(sessionId: string): Promise<void>;
    private storeInternal;
}
