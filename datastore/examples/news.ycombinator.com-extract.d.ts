import { Crawler, Datastore, Extractor, HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    crawlers: {
        hackernewsCrawler: Crawler<false, import("@ulixee/datastore-plugins-hero").IExtractorSchema<unknown, never>, {
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
        hackernews: Extractor<{
            output: {
                score: import("@ulixee/schema/lib/NumberSchema").default<false>;
                id: import("@ulixee/schema/lib/StringSchema").default<false>;
                age: import("@ulixee/schema/lib/StringSchema").default<false>;
                subject: import("@ulixee/schema/lib/StringSchema").default<false>;
                contributor: import("@ulixee/schema").ObjectSchema<{
                    id: import("@ulixee/schema/lib/StringSchema").default<false>;
                    username: import("@ulixee/schema/lib/StringSchema").default<false>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>;
                commentCount: import("@ulixee/schema/lib/NumberSchema").default<false>;
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            output: {
                score: import("@ulixee/schema/lib/NumberSchema").default<false>;
                id: import("@ulixee/schema/lib/StringSchema").default<false>;
                age: import("@ulixee/schema/lib/StringSchema").default<false>;
                subject: import("@ulixee/schema/lib/StringSchema").default<false>;
                contributor: import("@ulixee/schema").ObjectSchema<{
                    id: import("@ulixee/schema/lib/StringSchema").default<false>;
                    username: import("@ulixee/schema/lib/StringSchema").default<false>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>;
                commentCount: import("@ulixee/schema/lib/NumberSchema").default<false>;
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            output: {
                score: import("@ulixee/schema/lib/NumberSchema").default<false>;
                id: import("@ulixee/schema/lib/StringSchema").default<false>;
                age: import("@ulixee/schema/lib/StringSchema").default<false>;
                subject: import("@ulixee/schema/lib/StringSchema").default<false>;
                contributor: import("@ulixee/schema").ObjectSchema<{
                    id: import("@ulixee/schema/lib/StringSchema").default<false>;
                    username: import("@ulixee/schema/lib/StringSchema").default<false>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>;
                commentCount: import("@ulixee/schema/lib/NumberSchema").default<false>;
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore-plugins-hero").IExtractorContext<{
            output: {
                score: import("@ulixee/schema/lib/NumberSchema").default<false>;
                id: import("@ulixee/schema/lib/StringSchema").default<false>;
                age: import("@ulixee/schema/lib/StringSchema").default<false>;
                subject: import("@ulixee/schema/lib/StringSchema").default<false>;
                contributor: import("@ulixee/schema").ObjectSchema<{
                    id: import("@ulixee/schema/lib/StringSchema").default<false>;
                    username: import("@ulixee/schema/lib/StringSchema").default<false>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>;
                commentCount: import("@ulixee/schema/lib/NumberSchema").default<false>;
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            url: string;
            id: string;
            age: string;
            score: number;
            subject: string;
            contributor: {
                id: string;
                username: string;
            };
            commentCount: number;
        }, import("@ulixee/datastore-plugins-hero").IExtractorRunOptions<{
            output: {
                score: import("@ulixee/schema/lib/NumberSchema").default<false>;
                id: import("@ulixee/schema/lib/StringSchema").default<false>;
                age: import("@ulixee/schema/lib/StringSchema").default<false>;
                subject: import("@ulixee/schema/lib/StringSchema").default<false>;
                contributor: import("@ulixee/schema").ObjectSchema<{
                    id: import("@ulixee/schema/lib/StringSchema").default<false>;
                    username: import("@ulixee/schema/lib/StringSchema").default<false>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>;
                commentCount: import("@ulixee/schema/lib/NumberSchema").default<false>;
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & import("@ulixee/hero").IHeroCreateOptions & object>;
    };
}>;
export default datastore;
