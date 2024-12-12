import { ISchemaAny } from '@ulixee/schema';
import StringSchema from '@ulixee/schema/lib/StringSchema';
import DateSchema from '@ulixee/schema/lib/DateSchema';
import Extractor from './Extractor';
import IExtractorSchema, { ISchemaRecordType } from '../interfaces/IExtractorSchema';
import { IExtractorPluginConstructor } from '../interfaces/IExtractorPluginStatics';
import IExtractorContext from '../interfaces/IExtractorContext';
import ICrawlerComponents from '../interfaces/ICrawlerComponents';
import ICrawlerOutputSchema, { CrawlerOutputSchema } from '../interfaces/ICrawlerOutputSchema';
import Table from './Table';
import DatastoreInternal from './DatastoreInternal';
export default class Crawler<TDisableCache extends boolean = false, TProvidedSchema extends IExtractorSchema<unknown, never> = IExtractorSchema<unknown, never>, TFinalInput extends ISchemaRecordType<any> & typeof CrawlerInputSchema = TDisableCache extends true ? typeof CrawlerInputSchema & TProvidedSchema['input'] : TProvidedSchema extends {
    input: Record<string, ISchemaAny>;
} ? typeof CrawlerInputSchema & TProvidedSchema['input'] : typeof CrawlerInputSchema & Record<string, ISchemaAny>, TSchema extends IExtractorSchema<TFinalInput, typeof CrawlerOutputSchema> = IExtractorSchema<TFinalInput, typeof CrawlerOutputSchema>, TPlugin1 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin2 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TPlugin3 extends IExtractorPluginConstructor<TSchema> = IExtractorPluginConstructor<TSchema>, TContext extends Omit<IExtractorContext<TSchema>, 'Output' | 'outputs'> & TPlugin1['contextAddons'] & TPlugin2['contextAddons'] & TPlugin3['contextAddons'] = Omit<IExtractorContext<TSchema>, 'Output' | 'outputs'> & TPlugin1['contextAddons'] & TPlugin2['contextAddons'] & TPlugin3['contextAddons']> extends Extractor<TSchema, TPlugin1, TPlugin2, TPlugin3, TContext> {
    static defaultMaxTimeInCache: number;
    extractorType: string;
    cache?: Table<{
        input: StringSchema<false>;
        sessionId: StringSchema<false>;
        crawler: StringSchema<false>;
        version: StringSchema<false>;
        runTime: DateSchema<false>;
    }>;
    private crawlerComponents;
    constructor(components: (ICrawlerComponents<TProvidedSchema, TContext, TDisableCache> & TPlugin1['componentAddons'] & TPlugin2['componentAddons'] & TPlugin3['componentAddons']) | (ICrawlerComponents<TProvidedSchema, TContext, TDisableCache> & TPlugin1['componentAddons'] & TPlugin2['componentAddons'] & TPlugin3['componentAddons'])['run'], ...plugins: [plugin1?: TPlugin1, plugin2?: TPlugin2, plugin3?: TPlugin3]);
    attachToDatastore(datastoreInternal: DatastoreInternal<any, any>, extractorName: string): void;
    protected runWrapper(originalRun: ICrawlerComponents<TSchema, TContext>['run'], context: TContext): Promise<void>;
    protected saveToCache(input: TContext['input'], output: ICrawlerOutputSchema, onCacheUpdated?: TContext['onCacheUpdated']): Promise<{
        didCache?: boolean;
        replacedSessionId?: string;
    }>;
    protected findCached(input: TContext['input']): Promise<ICrawlerOutputSchema>;
    protected getSerializedInput(input: TContext['input']): string;
}
declare const CrawlerInputSchema: {
    maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
};
export {};
