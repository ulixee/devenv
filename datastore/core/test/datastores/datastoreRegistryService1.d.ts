import Datastore, { Extractor } from '@ulixee/datastore';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    extractors: {
        streamer: Extractor<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>>, import("@ulixee/datastore").IExtractorContext<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>> & object, {
            [x: string]: any;
        }, import("@ulixee/datastore").IExtractorRunOptions<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>> & object>;
    };
}>;
export default datastore;
