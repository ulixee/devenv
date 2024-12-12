import { ExtractSchemaType } from '@ulixee/schema';
import IExtractorComponents from '../interfaces/IExtractorComponents';
import IExtractorContext from '../interfaces/IExtractorContext';
import { IExtractorPluginConstructor } from '../interfaces/IExtractorPluginStatics';
import IExtractorSchema from '../interfaces/IExtractorSchema';
import DatastoreApiClient, { IDatastoreExecRelayArgs } from './DatastoreApiClient';
import Extractor from './Extractor';
export interface IPassthroughExtractorComponents<TRemoteSources extends Record<string, string>, TExtractorName extends string, TSchema extends IExtractorSchema = IExtractorSchema<any, any>, TContext extends IExtractorContext<TSchema> & IDatastoreExecRelayArgs = IExtractorContext<TSchema> & IDatastoreExecRelayArgs> {
    remoteExtractor: `${keyof TRemoteSources & string}.${TExtractorName}`;
    upcharge?: bigint | number;
    onRequest?: (context: TContext) => Promise<any>;
    onResponse?: (context: TContext & {
        stream: AsyncIterable<ExtractSchemaType<TSchema['output']>>;
    }) => Promise<any>;
}
export default class PassthroughExtractor<TRemoteSources extends Record<string, string>, TExtractorName extends string, TSchema extends IExtractorSchema = IExtractorSchema<any, any>, TPlugin1 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin2 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin3 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TOutput extends ExtractSchemaType<TSchema['output']> = ExtractSchemaType<TSchema['output']>, TContext extends IExtractorContext<TSchema> & IDatastoreExecRelayArgs = IExtractorContext<TSchema> & TPlugin1['contextAddons'] & TPlugin2['contextAddons'] & TPlugin3['contextAddons'] & IDatastoreExecRelayArgs> extends Extractor<TSchema, TPlugin1, TPlugin2, TPlugin3, TContext> {
    readonly remoteSource: string;
    readonly remoteExtractor: string;
    remoteDatastoreId: string;
    remoteVersion: string;
    remoteDomain: string;
    protected upstreamClient: DatastoreApiClient;
    protected readonly passThroughComponents: IPassthroughExtractorComponents<TRemoteSources, TExtractorName, TSchema, TContext>;
    constructor(components: Pick<IExtractorComponents<TSchema, TContext>, 'name' | 'description' | 'schema'> & IPassthroughExtractorComponents<TRemoteSources, TExtractorName> & TPlugin1['componentAddons'] & TPlugin2['componentAddons'] & TPlugin3['componentAddons'], ...plugins: [plugin1?: TPlugin1, plugin2?: TPlugin2, plugin3?: TPlugin3]);
    protected run(context: TContext): Promise<void>;
    protected injectRemoteClient(): Promise<void>;
}
