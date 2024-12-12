import Datastore, { Extractor } from '@ulixee/datastore';
import { HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';
declare const datastore: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    name: string;
    extractors: {
        docPages: Extractor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                title: import("@ulixee/schema/lib/StringSchema").default<false>;
                href: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }, typeof HeroExtractorPlugin, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                title: import("@ulixee/schema/lib/StringSchema").default<false>;
                href: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore/interfaces/IExtractorPluginStatics").IExtractorPluginConstructor<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                title: import("@ulixee/schema/lib/StringSchema").default<false>;
                href: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }>, import("@ulixee/datastore").IExtractorContext<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                title: import("@ulixee/schema/lib/StringSchema").default<false>;
                href: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & {
            Hero: typeof import("@ulixee/hero").default;
            HeroReplay: import("@ulixee/datastore-plugins-hero").HeroReplayCrawler;
        } & object, {
            href: string;
            title: string;
        }, import("@ulixee/datastore").IExtractorRunOptions<{
            input: {
                tool: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
            output: {
                title: import("@ulixee/schema/lib/StringSchema").default<false>;
                href: import("@ulixee/schema/lib/StringSchema").default<false>;
            };
        }> & import("@ulixee/hero").IHeroCreateOptions & object>;
    };
}>;
export default datastore;
