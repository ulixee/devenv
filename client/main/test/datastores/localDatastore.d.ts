import Datastore, { Extractor, Table } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    extractors: {
        test: Extractor<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object, {
            testerEcho: boolean;
            greeting: string;
            lastName: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                shouldTest: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            };
            output: {
                testerEcho: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
                greeting: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object>;
    };
    tables: {
        testers: Table<{
            firstName: import("@ulixee/schema/lib/StringSchema").default<false>;
            lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
            isTester: import("@ulixee/schema/lib/BooleanSchema").default<true>;
        }, {
            firstName: string;
            lastName: string;
            isTester?: boolean;
        }>;
    };
}>;
export default _default;
