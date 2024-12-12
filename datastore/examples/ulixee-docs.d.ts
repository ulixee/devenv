import Datastore, { Crawler, Extractor } from '@ulixee/datastore';
import { HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    name: string;
    description: string;
    crawlers: {
        pageCrawler: Crawler<false, {
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
        }, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            url: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            url: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            url: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            url: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, Omit<import("@ulixee/datastore").IExtractorContext<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            url: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, "Output" | "outputs"> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object>;
        searchCrawler: Crawler<false, {
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, {
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            query: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            query: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            query: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            query: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, Omit<import("@ulixee/datastore").IExtractorContext<import("@ulixee/datastore").IExtractorSchema<{
            maxTimeInCache: import("@ulixee/schema/lib/NumberSchema").default<true>;
        } & {
            query: import("@ulixee/schema/lib/StringSchema").default<false>;
        }, {
            crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
            version: import("@ulixee/schema/lib/StringSchema").default<false>;
            sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
        }>>, "Output" | "outputs"> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object>;
    };
    extractors: {
        allPages: Extractor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            link: string;
            name: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & import("@ulixee/hero").IHeroCreateOptions & object>;
        getDocumentation: Extractor<{
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
            output: {
                type: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                details: import("@ulixee/schema/lib/StringSchema").default<false>;
                args: import("@ulixee/schema").ArraySchema<import("@ulixee/schema").ObjectSchema<{
                    name: import("@ulixee/schema/lib/StringSchema").default<false>;
                    type: import("@ulixee/schema/lib/StringSchema").default<false>;
                    optional: import("@ulixee/schema/lib/BooleanSchema").default<true>;
                    description: import("@ulixee/schema/lib/StringSchema").default<true>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>, true>;
                returnType: import("@ulixee/schema/lib/StringSchema").default<true>;
            };
        }, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
            output: {
                type: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                details: import("@ulixee/schema/lib/StringSchema").default<false>;
                args: import("@ulixee/schema").ArraySchema<import("@ulixee/schema").ObjectSchema<{
                    name: import("@ulixee/schema/lib/StringSchema").default<false>;
                    type: import("@ulixee/schema/lib/StringSchema").default<false>;
                    optional: import("@ulixee/schema/lib/BooleanSchema").default<true>;
                    description: import("@ulixee/schema/lib/StringSchema").default<true>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>, true>;
                returnType: import("@ulixee/schema/lib/StringSchema").default<true>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
            output: {
                type: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                details: import("@ulixee/schema/lib/StringSchema").default<false>;
                args: import("@ulixee/schema").ArraySchema<import("@ulixee/schema").ObjectSchema<{
                    name: import("@ulixee/schema/lib/StringSchema").default<false>;
                    type: import("@ulixee/schema/lib/StringSchema").default<false>;
                    optional: import("@ulixee/schema/lib/BooleanSchema").default<true>;
                    description: import("@ulixee/schema/lib/StringSchema").default<true>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>, true>;
                returnType: import("@ulixee/schema/lib/StringSchema").default<true>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
            output: {
                type: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                details: import("@ulixee/schema/lib/StringSchema").default<false>;
                args: import("@ulixee/schema").ArraySchema<import("@ulixee/schema").ObjectSchema<{
                    name: import("@ulixee/schema/lib/StringSchema").default<false>;
                    type: import("@ulixee/schema/lib/StringSchema").default<false>;
                    optional: import("@ulixee/schema/lib/BooleanSchema").default<true>;
                    description: import("@ulixee/schema/lib/StringSchema").default<true>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>, true>;
                returnType: import("@ulixee/schema/lib/StringSchema").default<true>;
            };
        }> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            link: string;
            name: string;
            type: string;
            details: string;
            args?: {
                name: string;
                type: string;
                optional?: boolean;
                description?: string;
            }[];
            returnType?: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                url: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            inputExamples: {
                url: string;
            }[];
            output: {
                type: import("@ulixee/schema/lib/StringSchema").default<false>;
                name: import("@ulixee/schema/lib/StringSchema").default<false>;
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                details: import("@ulixee/schema/lib/StringSchema").default<false>;
                args: import("@ulixee/schema").ArraySchema<import("@ulixee/schema").ObjectSchema<{
                    name: import("@ulixee/schema/lib/StringSchema").default<false>;
                    type: import("@ulixee/schema/lib/StringSchema").default<false>;
                    optional: import("@ulixee/schema/lib/BooleanSchema").default<true>;
                    description: import("@ulixee/schema/lib/StringSchema").default<true>;
                }, false, import("@ulixee/schema/lib/BaseSchema").default<any, boolean, import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>> & import("@ulixee/schema/lib/BaseSchema").IBaseConfig<boolean>>, true>;
                returnType: import("@ulixee/schema/lib/StringSchema").default<true>;
            };
        }> & import("@ulixee/hero").IHeroCreateOptions & object>;
        search: Extractor<{
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                match: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                match: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                match: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                match: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            match: string;
            link: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                query: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                link: import("@ulixee/schema/lib/StringSchema").default<false>;
                match: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & import("@ulixee/hero").IHeroCreateOptions & object>;
    };
}>;
export default datastore;
