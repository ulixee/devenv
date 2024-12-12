import IDatastoreApiTypes from '@ulixee/platform-specification/datastore/DatastoreApis';
import { IncomingMessage, ServerResponse } from 'http';
import DatastoreRegistry from '../lib/DatastoreRegistry';
export declare const datastorePathRegex: RegExp;
export default class DocpageRoutes {
    private datastoreRegistry;
    private serverAddress;
    private getCredits;
    private cacheTime;
    private staticServe;
    constructor(datastoreRegistry: DatastoreRegistry, serverAddress: URL, getCredits: (args: IDatastoreApiTypes['Datastore.creditsBalance']['args']) => Promise<any>, cacheTime?: number);
    routeCreditsBalanceApi(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
    routeHttp(req: IncomingMessage, res: ServerResponse, params: string[]): Promise<boolean>;
}
