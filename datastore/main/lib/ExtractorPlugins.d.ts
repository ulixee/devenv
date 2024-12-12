import IExtractorPlugin from '../interfaces/IExtractorPlugin';
import IExtractorSchema from '../interfaces/IExtractorSchema';
import IExtractorContext from '../interfaces/IExtractorContext';
import IExtractorComponents from '../interfaces/IExtractorComponents';
import ExtractorInternal from './ExtractorInternal';
import DatastoreInternal, { IQueryInternalCallbacks } from './DatastoreInternal';
export default class ExtractorPlugins<ISchema extends IExtractorSchema, IRunContext extends IExtractorContext<ISchema> = IExtractorContext<ISchema>> {
    #private;
    private clientPlugins;
    private pluginNextPromises;
    private pluginRunPromises;
    constructor(components: IExtractorComponents<ISchema, IExtractorContext<ISchema>>, plugins: (new (comps: IExtractorComponents<ISchema, IExtractorContext<ISchema>>) => IExtractorPlugin<ISchema>)[]);
    initialize(extractorInternal: ExtractorInternal<ISchema>, datastoreInternal: DatastoreInternal, callbacks: IQueryInternalCallbacks): Promise<IRunContext>;
    setResolution(outputs: IRunContext['outputs'], error?: Error): Promise<void>;
}
