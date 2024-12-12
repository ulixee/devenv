import Datastore, { Extractor, Table } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    name: string;
    extractors: {
        cloneUpstream: Extractor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object, {
            affiliateId: string;
            success: boolean;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                field: import("@ulixee/schema/lib/StringSchema").default<false>;
                nested: import("@ulixee/schema").ObjectSchema<{
                    field2: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                }, true, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>>;
            };
            output: {
                success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                affiliateId: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & object>;
    };
    tables: {
        users: Table<{
            name: import("@ulixee/schema/lib/StringSchema").default<false>;
            birthdate: import("@ulixee/schema/lib/DateSchema").default<false>;
        }, {
            name: string;
            birthdate: Date;
        }>;
        private: Table<{
            secret: import("@ulixee/schema/lib/StringSchema").default<false>;
            key: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            key: string;
            secret: string;
        }>;
    };
}>;
export default _default;
