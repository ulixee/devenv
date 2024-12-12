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
        testPayments: Extractor<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object, {
            success: boolean;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                explode: import("@ulixee/schema/lib/BooleanSchema").default<true>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
        }> & object>;
    };
    tables: {
        successTitles: Table<{
            title: import("@ulixee/schema/lib/StringSchema").default<false>;
            success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
        }, {
            success: boolean;
            title: string;
        }>;
        titleNames: Table<{
            title: import("@ulixee/schema/lib/StringSchema").default<false>;
            name: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            name: string;
            title: string;
        }>;
    };
    onCreated(this: Datastore<{
        [x: string]: any;
    }, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }, import("@ulixee/datastore/interfaces/IDatastoreComponents").default<{
        [x: string]: any;
    }, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }>>): Promise<void>;
}>;
export default _default;
