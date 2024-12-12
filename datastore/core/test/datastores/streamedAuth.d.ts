import Datastore, { Extractor } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    authenticateIdentity(identity: string): identity is "id1TOFILLIN";
    extractors: {
        authme: Extractor<import("@ulixee/datastore").IExtractorSchema<{
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
export default _default;
