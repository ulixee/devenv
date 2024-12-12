import { ConnectionToCore } from '@ulixee/net';
import { IReplayRegistryApis, IReplayRegistryApiTypes } from '@ulixee/platform-specification/services/ReplayRegistryApis';
export default class ReplayRegistryServiceClient {
    private client;
    constructor(client: ConnectionToCore<IReplayRegistryApis, {}>);
    store(details: IReplayRegistryApiTypes['ReplayRegistry.store']['args']): Promise<IReplayRegistryApiTypes['ReplayRegistry.store']['result']>;
    delete(sessionId: string): Promise<IReplayRegistryApiTypes['ReplayRegistry.delete']['result']>;
    get(sessionId: string): Promise<IReplayRegistryApiTypes['ReplayRegistry.get']['result']>;
    ids(): Promise<IReplayRegistryApiTypes['ReplayRegistry.ids']['result']>;
}
