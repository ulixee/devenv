import IExtractorPluginCore from '@ulixee/datastore/interfaces/IExtractorPluginCore';
export default class DatastoreForPuppeteerCore implements IExtractorPluginCore {
    name: any;
    version: any;
    nodeVmRequireWhitelist: string[];
}
