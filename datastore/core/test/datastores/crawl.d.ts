import Datastore, { Crawler, Extractor } from '@ulixee/datastore';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    crawlers: {
        crawl: Crawler<false, import("@ulixee/datastore").IExtractorSchema<unknown, never>, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, Omit<import("@ulixee/datastore").IExtractorContext<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, "Output" | "outputs"> & object>;
        crawlWithSchema: Crawler<false, {
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
        }, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, Omit<import("@ulixee/datastore").IExtractorContext<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
            colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
            colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, "Output" | "outputs"> & object>;
    };
    extractors: {
        crawlCall: Extractor<import("@ulixee/datastore").IExtractorSchema<{
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
        crawlWithSchemaCall: Extractor<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }> & object, {
            sessionId: string;
            runCrawlerTime?: Date;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                colBool: import("@ulixee/schema/lib/BooleanSchema").default<false>;
                colNum: import("@ulixee/schema/lib/NumberSchema").default<false>;
            };
            output: {
                sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
                runCrawlerTime: import("@ulixee/schema/lib/DateSchema").default<true>;
            };
        }> & object>;
    };
}>;
export default datastore;
