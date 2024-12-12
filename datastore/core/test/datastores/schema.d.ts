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
        default: Extractor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object, {
            success: boolean;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object>;
    };
}>;
export default _default;
