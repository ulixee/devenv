import '@ulixee/commons/lib/SourceMapSupport';
import { IExtractorContext, IExtractorRunOptions, IExtractorPlugin, IExtractorSchema } from '@ulixee/datastore';
import * as Puppeteer from 'puppeteer';
import { Browser as PuppeteerBrowser, PuppeteerLaunchOptions as IPuppeteerLaunchOptions } from 'puppeteer';
import ExtractorInternal from '@ulixee/datastore/lib/ExtractorInternal';
export * from '@ulixee/datastore';
type IContextAddons = {
    launchBrowser(): Promise<PuppeteerBrowser>;
};
export type IPuppeteerExtractorContext<ISchema> = IExtractorContext<ISchema> & IContextAddons;
export type IPuppeteerExtractorRunOptions<ISchema> = IExtractorRunOptions<ISchema> & IPuppeteerLaunchOptions;
export declare class PuppeteerExtractorPlugin<ISchema extends IExtractorSchema> implements IExtractorPlugin<ISchema, IPuppeteerExtractorRunOptions<ISchema>, IPuppeteerExtractorContext<ISchema>> {
    static readonly runArgAddons: IPuppeteerLaunchOptions;
    static readonly contextAddons: IContextAddons;
    name: any;
    version: any;
    puppeteerBrowserPromise: Promise<Puppeteer.Browser>;
    private runOptions;
    run(extractorInternal: ExtractorInternal<ISchema, IPuppeteerExtractorRunOptions<ISchema>>, context: IPuppeteerExtractorContext<ISchema>, next: () => Promise<IExtractorContext<ISchema>['outputs']>): Promise<void>;
    protected initializePuppeteer(): Promise<PuppeteerBrowser>;
}
