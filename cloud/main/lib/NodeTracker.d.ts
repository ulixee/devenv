import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import INodeRegistryApiTypes, { ICloudNodeMeta } from '@ulixee/platform-specification/services/NodeRegistryApis';
type THealth = INodeRegistryApiTypes['NodeRegistry.health']['args'];
export default class NodeTracker extends TypedEventEmitter<{
    new: {
        node: ICloudNodeMeta;
    };
}> {
    readonly lastSeenCutoffMinutes: number;
    get count(): number;
    get nodes(): ICloudNodeMeta[];
    private readonly nodeHealthByIdentity;
    private readonly nodesByIdentity;
    private nodesInSeenOrder;
    constructor(lastSeenCutoffMinutes?: number);
    track(node: ICloudNodeMeta): {
        nodes: ICloudNodeMeta[];
    };
    checkin(health: THealth): void;
    private sortSeenNodes;
    private prune;
}
export {};
