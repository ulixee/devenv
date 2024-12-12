import '@ulixee/commons/lib/SourceMapSupport';
import Hero, { HeroReplay, IHeroCreateOptions, IHeroReplayCreateOptions } from '@ulixee/hero';
import ICoreSession from '@ulixee/hero/interfaces/ICoreSession';
import ExtractorInternal from '@ulixee/datastore/lib/ExtractorInternal';
import IExtractorSchema from '@ulixee/datastore/interfaces/IExtractorSchema';
import { Crawler, IExtractorComponents, IExtractorRunOptions } from '@ulixee/datastore';
import IExtractorContextBase from '@ulixee/datastore/interfaces/IExtractorContext';
import ICrawlerOutputSchema from '@ulixee/datastore/interfaces/ICrawlerOutputSchema';
export * from '@ulixee/datastore';
export type IHeroExtractorRunOptions<ISchema> = IExtractorRunOptions<ISchema> & IHeroCreateOptions;
declare module '@ulixee/hero/lib/extendables' {
    interface Hero {
        toCrawlerOutput(): Promise<ICrawlerOutputSchema>;
    }
}
export type HeroReplayCrawler = typeof HeroReplay & {
    new (options: IHeroReplayCreateOptions | ICrawlerOutputSchema): HeroReplay;
    fromCrawler<T extends Crawler>(crawler: T, options?: T['runArgsType']): Promise<HeroReplay>;
};
export type IHeroExtractorContext<ISchema> = IExtractorContextBase<ISchema> & {
    Hero: typeof Hero;
    HeroReplay: HeroReplayCrawler;
};
export type IHeroExtractorComponents<ISchema> = IExtractorComponents<ISchema, IHeroExtractorContext<ISchema>>;
export declare class HeroExtractorPlugin<ISchema extends IExtractorSchema> {
    static runArgAddons: IHeroCreateOptions;
    static contextAddons: {
        Hero: typeof Hero;
        HeroReplay: HeroReplayCrawler;
    };
    name: any;
    version: any;
    hero: Hero;
    heroReplays: Set<HeroReplay>;
    extractorInternal: ExtractorInternal<ISchema, IHeroExtractorRunOptions<ISchema>>;
    runOptions: IHeroExtractorRunOptions<ISchema>;
    components: IHeroExtractorComponents<ISchema>;
    private pendingOutputs;
    private pendingUploadPromises;
    private coreSessionPromise;
    constructor(components: IHeroExtractorComponents<ISchema>);
    run(extractorInternal: ExtractorInternal<ISchema, IHeroExtractorRunOptions<ISchema>>, context: IHeroExtractorContext<ISchema>, next: () => Promise<IHeroExtractorContext<ISchema>['outputs']>): Promise<void>;
    protected onConnected(source: Hero | HeroReplay): void;
    protected registerSessionClose(coreSessionPromise: Promise<ICoreSession>): Promise<void>;
    protected uploadOutputs(): void;
    private onOutputChanged;
}
