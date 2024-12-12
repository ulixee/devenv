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
    extractors: {
        moment: Extractor<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }> & object, {
            date: Date;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                date: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                date: import("@ulixee/schema/lib/DateSchema").default<false>;
            };
        }> & object>;
    };
}>;
export default _default;
