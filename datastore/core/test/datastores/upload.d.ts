import Datastore, { Extractor } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    extractors: {
        upTest: Extractor<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object, {
            upload: boolean;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            output: {
                upload: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object>;
    };
}>;
export default _default;
