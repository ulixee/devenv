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
        remote: Extractor<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object, {
            iAmRemote: boolean;
            echo: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                test: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                iAmRemote: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                echo: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object>;
    };
}>;
export default _default;
