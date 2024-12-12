import ConnectionToClient from '@ulixee/net/lib/ConnectionToClient';
import { IReplayRegistryApis } from '@ulixee/platform-specification/services/ReplayRegistryApis';
import ReplayRegistry from '../lib/ReplayRegistry';
export type TServicesApis = IReplayRegistryApis<IHeroPluginApiContext>;
export default class ReplayRegistryEndpoints {
    private readonly handlersByCommand;
    constructor();
    attachToConnection<T extends ConnectionToClient<any, any>>(connection: T, context: IHeroPluginApiContext): T;
}
export interface IHeroPluginApiContext {
    replayRegistry: ReplayRegistry;
}
