import Datastore, { Extractor, Table } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
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
    tables: {
        streamTable: Table<{
            title: import("@ulixee/schema/lib/StringSchema").default<false>;
            success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
        }, {
            success: boolean;
            title: string;
        }>;
    };
}>;
export default _default;
