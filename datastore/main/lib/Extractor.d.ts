import { ExtractSchemaType } from '@ulixee/schema';
import { IExtractorPluginConstructor } from '../interfaces/IExtractorPluginStatics';
import IExtractorContext from '../interfaces/IExtractorContext';
import IExtractorSchema from '../interfaces/IExtractorSchema';
import IExtractorRunOptions from '../interfaces/IExtractorRunOptions';
import IExtractorComponents from '../interfaces/IExtractorComponents';
import DatastoreInternal, { IDatastoreBinding, IQueryInternalCallbacks } from './DatastoreInternal';
import ResultIterable from './ResultIterable';
export default class Extractor<TSchema extends IExtractorSchema = IExtractorSchema, TPlugin1 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin2 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin3 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TContext extends IExtractorContext<TSchema> = IExtractorContext<TSchema> & TPlugin1['contextAddons'] & TPlugin2['contextAddons'] & TPlugin3['contextAddons'], TOutput extends ExtractSchemaType<TSchema['output']> = ExtractSchemaType<TSchema['output']>, TRunArgs extends IExtractorRunOptions<TSchema> & TPlugin1['runArgAddons'] & TPlugin2['runArgAddons'] & TPlugin3['runArgAddons'] = IExtractorRunOptions<TSchema> & TPlugin1['runArgAddons'] & TPlugin2['runArgAddons'] & TPlugin3['runArgAddons']> {
    #private;
    readonly schemaType: {
        input: ExtractSchemaType<TSchema['input']>;
        output: ExtractSchemaType<TSchema['output']>;
    };
    readonly runArgsType: TRunArgs;
    extractorType: string;
    corePlugins: {
        [name: string]: string;
    };
    pluginClasses: IExtractorPluginConstructor<TSchema>[];
    successCount: number;
    errorCount: number;
    basePrice: bigint;
    get schema(): TSchema;
    get name(): string;
    get description(): string | undefined;
    protected get datastoreInternal(): DatastoreInternal;
    protected readonly components: IExtractorComponents<TSchema, TContext> & TPlugin1['componentAddons'] & TPlugin2['componentAddons'] & TPlugin3['componentAddons'];
    constructor(components: (IExtractorComponents<TSchema, TContext> | IExtractorComponents<TSchema, TContext>['run']) & TPlugin1['componentAddons'] & TPlugin2['componentAddons'] & TPlugin3['componentAddons'], ...plugins: [plugin1?: TPlugin1, plugin2?: TPlugin2, plugin3?: TPlugin3]);
    runInternal(options: TRunArgs, callbacks?: IQueryInternalCallbacks): ResultIterable<TOutput, Record<string, any>>;
    queryInternal(sql: string, boundValues?: any[], options?: TRunArgs): Promise<any>;
    attachToDatastore(datastoreInternal: DatastoreInternal<any, any>, extractorName: string): void;
    bind(config: IDatastoreBinding): Promise<DatastoreInternal>;
}
