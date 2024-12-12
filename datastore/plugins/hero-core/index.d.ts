import IDatastoreCoreConfigureOptions from '@ulixee/datastore-core/interfaces/IDatastoreCoreConfigureOptions';
import { IHeroExtractorRunOptions } from '@ulixee/datastore-plugins-hero';
import type IExtractorPluginCore from '@ulixee/datastore/interfaces/IExtractorPluginCore';
import type { ICacheUpdates } from '@ulixee/datastore/interfaces/IExtractorPluginCore';
import { ConnectionToClient, ConnectionToCore } from '@ulixee/net';
import ReplayRegistry from './lib/ReplayRegistry';
export default class DatastoreForHeroPluginCore implements IExtractorPluginCore {
    name: any;
    version: any;
    replayRegistry: ReplayRegistry;
    nodeVmRequireWhitelist: string[];
    private connectionToCore;
    private nodeVmSandboxList;
    private endpoints;
    onCoreStart(coreConfigureOptions: IDatastoreCoreConfigureOptions, options: {
        createConnectionToServiceHost: (host: string) => ConnectionToCore<any, any>;
        getSystemCore: (name: 'heroCore' | 'datastoreCore' | 'desktopCore') => any;
    }): Promise<void>;
    beforeRunExtractor(options: IHeroExtractorRunOptions<unknown>, runtime: {
        scriptEntrypoint: string;
        functionName: string;
    }): void;
    afterRunExtractor(_options: IHeroExtractorRunOptions<any>, _output: unknown, cacheUpdates: ICacheUpdates): Promise<void>;
    registerHostedServices(connectionToClient: ConnectionToClient<any, any>): void;
    onCoreClose(): Promise<void>;
}
