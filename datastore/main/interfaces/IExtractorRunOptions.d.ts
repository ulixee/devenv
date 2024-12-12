import IExtractorSchema, { ExtractSchemaType } from './IExtractorSchema';
import IQueryOptions from './IQueryOptions';
export default interface IExtractorRunOptions<ISchema extends IExtractorSchema> extends Partial<IQueryOptions> {
    input?: ExtractSchemaType<ISchema['input']>;
    trackMetadata?: (name: string, value: any, pluginId?: string) => void;
}
