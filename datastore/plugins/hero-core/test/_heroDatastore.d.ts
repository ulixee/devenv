import Datastore, { Extractor } from '@ulixee/datastore';
import { Crawler, HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    crawlers: {
        defaultCrawl: Crawler<false, import("@ulixee/datastore").IExtractorSchema<unknown, never>, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & Record<string, import("@ulixee/schema").ISchemaAny>, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
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
        }>>, "Output" | "outputs"> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object>;
    };
    extractors: {
        getTitle: Extractor<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
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
        }>> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            [x: string]: any;
        }, import("@ulixee/datastore").IExtractorRunOptions<import("@ulixee/datastore").IExtractorSchema<{
            [x: string]: any;
        }, {
            [x: string]: any;
        }>> & import("@ulixee/hero").IHeroCreateOptions & object>;
    };
}>;
export default datastore;
