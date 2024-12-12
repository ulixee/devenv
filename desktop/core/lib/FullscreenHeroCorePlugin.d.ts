import { ISessionSummary } from '@ulixee/hero-interfaces/ICorePlugin';
import CorePlugin from '@ulixee/hero-plugin-utils/lib/CorePlugin';
import { Page } from '@ulixee/unblocked-agent';
import IEmulationProfile from '@ulixee/unblocked-specification/plugin/IEmulationProfile';
export default class FullscreenHeroCorePlugin extends CorePlugin {
    static id: string;
    configure(options: IEmulationProfile): Promise<any> | void;
    onNewPage(page: Page): Promise<any>;
    private getMaxChromeViewport;
    static shouldActivate(profile: IEmulationProfile, session: ISessionSummary): boolean;
}
