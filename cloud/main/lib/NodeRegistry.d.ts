import Identity from '@ulixee/platform-utils/lib/Identity';
import DatastoreCore from '@ulixee/datastore-core';
import HeroCore from '@ulixee/hero-core';
import { ConnectionToCore } from '@ulixee/net';
import { ICloudNodeMeta, INodeRegistryApis } from '@ulixee/platform-specification/services/NodeRegistryApis';
import NodeRegistryServiceClient from './NodeRegistryServiceClient';
import NodeTracker from './NodeTracker';
import RoutableServer from './RoutableServer';
export default class NodeRegistry {
    private config;
    serviceClient?: NodeRegistryServiceClient;
    nodeMeta: ICloudNodeMeta;
    private readonly nodeTracker;
    constructor(config: {
        publicServer: RoutableServer;
        serviceClient?: ConnectionToCore<INodeRegistryApis, {}>;
        nodeTracker: NodeTracker;
        datastoreCore: DatastoreCore;
        heroCore: HeroCore;
    });
    close(): Promise<void>;
    register(identity: Identity): Promise<void>;
    getNodes(count?: number): Promise<ICloudNodeMeta[]>;
}
