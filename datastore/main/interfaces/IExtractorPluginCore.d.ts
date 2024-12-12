import type IDatastoreCoreConfigureOptions from '@ulixee/datastore-core/interfaces/IDatastoreCoreConfigureOptions';
import type IExtractorRunOptions from '@ulixee/datastore/interfaces/IExtractorRunOptions';
import type IExtractorSchema from '@ulixee/datastore/interfaces/IExtractorSchema';
import { ConnectionToClient, ConnectionToCore } from '@ulixee/net';
export interface ICacheUpdates {
    [sessionId: string]: {
        action: 'cached' | 'evicted';
        crawler: string;
    };
}
export default interface IExtractorPluginCore<ISchema extends IExtractorSchema = any> {
    name: string;
    version: string;
    nodeVmRequireWhitelist?: string[];
    registerHostedServices?(connectionToClient: ConnectionToClient<any, any>): void;
    onCoreStart?(coreConfiguration: IDatastoreCoreConfigureOptions, options?: {
        createConnectionToServiceHost: (host: string) => ConnectionToCore<any, any>;
        getSystemCore: (name: string) => any;
    }): void | Promise<void>;
    beforeRunExtractor?(options: IExtractorRunOptions<ISchema>, runtime?: {
        scriptEntrypoint: string;
        functionName: string;
    }): void | Promise<void>;
    afterRunExtractor?(options: IExtractorRunOptions<ISchema>, output: ISchema['output'], cacheUpdates: ICacheUpdates, runtime?: {
        scriptEntrypoint: string;
        functionName: string;
    }): void | Promise<void>;
    onCoreClose?(): void | Promise<void>;
}
