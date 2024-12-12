import { Crawler, Datastore, Extractor, HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    crawlers: {
        crawl: Crawler<false, import("@ulixee/datastore-plugins-hero").IExtractorSchema<unknown, never>, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, Omit<import("@ulixee/datastore-plugins-hero").IExtractorContext<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, "Output" | "outputs"> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object>;
    };
    extractors: {
        extract: Extractor<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>>, import("@ulixee/datastore-plugins-hero").IExtractorContext<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            [x: string]: any;
        }, import("@ulixee/datastore-plugins-hero").IExtractorRunOptions<import("@ulixee/datastore-plugins-hero").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>> & import("@ulixee/hero").IHeroCreateOptions & object>;
    };
}>;
export default datastore;
