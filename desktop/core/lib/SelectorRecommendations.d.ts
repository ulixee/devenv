import { ISelectorMap } from '@ulixee/desktop-interfaces/ISelectorMap';
import IScriptInvocationMeta from '@ulixee/hero-interfaces/IScriptInvocationMeta';
export default class SelectorRecommendations {
    private scriptMetadata;
    private config;
    private readonly projectPath;
    private readonly relativeScriptPath;
    constructor(scriptMetadata: IScriptInvocationMeta);
    save(map: ISelectorMap, url: string): Promise<void>;
    private getFilename;
    private findProjectPath;
}
