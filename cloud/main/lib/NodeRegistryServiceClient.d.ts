import DatastoreCore from '@ulixee/datastore-core';
import HeroCore from '@ulixee/hero-core';
import { ConnectionToCore } from '@ulixee/net';
import { INodeRegistryApis, INodeRegistryApiTypes } from '@ulixee/platform-specification/services/NodeRegistryApis';
export default class NodeRegistryServiceClient {
    private heroCore;
    private getConnections;
    client: ConnectionToCore<INodeRegistryApis, {}>;
    private lastClusterCheckTimestamp;
    private heartbeatInternal;
    private eventSubscriber;
    private statsBuckets;
    private get stats();
    private nodeId;
    constructor(connectionToCore: ConnectionToCore<INodeRegistryApis, {}>, datastoreCore: DatastoreCore, heroCore: HeroCore, getConnections: () => {
        clients: number;
    });
    close(): Promise<void>;
    getNodes(count: number): Promise<INodeRegistryApiTypes['NodeRegistry.getNodes']['result']>;
    register(details: INodeRegistryApiTypes['NodeRegistry.register']['args']): Promise<INodeRegistryApiTypes['NodeRegistry.register']['result']>;
    private sendHealth;
    private heartbeat;
    private shouldReloadNodes;
}
