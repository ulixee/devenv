import IExtractorComponents from './IExtractorComponents';
import IExtractorContext from './IExtractorContext';
import IExtractorRunOptions from './IExtractorRunOptions';
import IExtractorPlugin from './IExtractorPlugin';
export type IExtractorPluginConstructor<ISchema, IExtraAddons = object, TContextAddons = object, TComponentAddons = object> = {
    new (components?: IExtractorComponents<ISchema, IExtractorContext<ISchema> & TComponentAddons>): IExtractorPlugin<ISchema, IExtractorRunOptions<ISchema> & IExtraAddons, IExtractorContext<ISchema> & TContextAddons>;
    readonly runArgAddons?: IExtraAddons;
    readonly componentAddons?: TContextAddons;
    readonly contextAddons?: TComponentAddons;
};
export declare function ExtractorPluginStatics<ISchema>(staticClass: IExtractorPluginConstructor<ISchema>): void;
