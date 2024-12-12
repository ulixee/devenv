import IExtractorRunOptions from './IExtractorRunOptions';
import IExtractorSchema from './IExtractorSchema';
import IExtractorContext from './IExtractorContext';
import ExtractorInternal from '../lib/ExtractorInternal';
export default interface IExtractorPlugin<ISchema extends IExtractorSchema, IOptions extends IExtractorRunOptions<ISchema> = IExtractorRunOptions<ISchema>, IContext extends IExtractorContext<ISchema> = IExtractorContext<ISchema>> {
    name: string;
    version: string;
    run(extractorInternal: ExtractorInternal<ISchema, IOptions>, context: IContext, next: () => Promise<IExtractorContext<ISchema>['outputs']>): Promise<void>;
}
