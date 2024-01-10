import type ICoreResponsePayload from '@ulixee/net/interfaces/ICoreResponsePayload';
import { IDatastoreApis, IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import IArgonFile from '@ulixee/platform-specification/types/IArgonFile';
import type IQueryLogEntry from '@ulixee/datastore/interfaces/IQueryLogEntry';
import type ILocalUserProfile from '@ulixee/datastore/interfaces/ILocalUserProfile';
import IChromeAliveSessionApi from './IChromeAliveSessionApi';
import IDevtoolsBackdoorApi from './IDevtoolsBackdoorApi';
import IDatastoreApi from './IDatastoreApi';
import IAppApi from './IAppApi';
import IHeroSessionsApi from './IHeroSessionsApi';
import { ICloudConnected, IUserBalance } from './IDesktopApis';
export declare type IChromeAliveSessionApis = {
    'Session.load': IChromeAliveSessionApi['load'];
    'Session.close': IChromeAliveSessionApi['close'];
    'Session.timetravel': IChromeAliveSessionApi['timetravel'];
    'Session.getTimetravelState': IChromeAliveSessionApi['getTimetravelState'];
    'Session.resume': IChromeAliveSessionApi['resume'];
    'Session.pause': IChromeAliveSessionApi['pause'];
    'Session.getResources': IChromeAliveSessionApi['getResources'];
    'Session.getResourceDetails': IChromeAliveSessionApi['getResourceDetails'];
    'Session.getScreenshot': IChromeAliveSessionApi['getScreenshot'];
    'Session.getScriptState': IChromeAliveSessionApi['getScriptState'];
    'Session.openMode': IChromeAliveSessionApi['openMode'];
    'Session.getDom': IChromeAliveSessionApi['getDom'];
    'Session.getMeta': IChromeAliveSessionApi['getMeta'];
    'Session.searchDom': IChromeAliveSessionApi['searchDom'];
    'Session.searchResources': IChromeAliveSessionApi['searchResources'];
    'Session.replayTargetCreated': IChromeAliveSessionApi['replayTargetCreated'];
    'Session.devtoolsTargetOpened': IChromeAliveSessionApi['devtoolsTargetOpened'];
    'Datastore.rerunExtractor': IDatastoreApi['rerunExtractor'];
    'Datastore.getOutput': IDatastoreApi['getOutput'];
    'Datastore.getCollectedAssets': IDatastoreApi['getCollectedAssets'];
    'DevtoolsBackdoor.toggleInspectElementMode': IDevtoolsBackdoorApi['toggleInspectElementMode'];
    'DevtoolsBackdoor.highlightNode': IDevtoolsBackdoorApi['highlightNode'];
    'DevtoolsBackdoor.hideHighlight': IDevtoolsBackdoorApi['hideHighlight'];
    'DevtoolsBackdoor.generateQuerySelector': IDevtoolsBackdoorApi['generateQuerySelector'];
};
export declare type IDesktopAppApis = {
    'App.connect': IAppApi['connect'];
    'Sessions.search': IHeroSessionsApi['search'];
    'Sessions.list': IHeroSessionsApi['list'];
    'Datastores.list': IDatastoreApis['Datastores.list'];
    'Datastore.meta': IDatastoreApis['Datastore.meta'];
    'Datastore.stats': IDatastoreApis['Datastore.stats'];
    'Datastore.versions': IDatastoreApis['Datastore.versions'];
    'Datastore.creditsIssued': IDatastoreApis['Datastore.creditsIssued'];
};
export declare type IDatastoreResultItem = IDatastoreApiTypes['Datastores.list']['result']['datastores'][0];
export declare type TCredit = {
    datastoreUrl: string;
    microgons: number;
};
export declare type IDesktopAppPrivateApis = {
    'Argon.dropFile': (path: string) => Promise<void>;
    'Credit.create': (args: {
        datastore: Pick<IDatastoreResultItem, 'id' | 'version' | 'name' | 'scriptEntrypoint'>;
        cloud: string;
        argons: number;
    }) => Promise<{
        credit: TCredit;
        filename: string;
    }>;
    'Credit.save': (arg: {
        credit: IArgonFile['credit'];
    }) => Promise<void>;
    'Credit.showContextMenu': (args: {
        credit: TCredit;
        filename: string;
        position: {
            x: number;
            y: number;
        };
    }) => Promise<void>;
    'Cloud.findAdminIdentity': (cloudName: string) => Promise<string>;
    'Datastore.setAdminIdentity': (datastoreId: string, adminIdentityPath: string) => Promise<string>;
    'Datastore.findAdminIdentity': (datastoreId: string) => Promise<string>;
    'Datastore.getInstalled': () => ILocalUserProfile['installedDatastores'];
    'Datastore.query': (args: {
        id: string;
        version: string;
        cloudHost: string;
        query: string;
    }) => Promise<IQueryLogEntry>;
    'Datastore.deploy': (args: {
        id: string;
        version: string;
        cloudHost: string;
        cloudName: string;
    }) => Promise<void>;
    'Datastore.install': (arg: {
        id: string;
        cloudHost: string;
        version: string;
    }) => Promise<void>;
    'Datastore.uninstall': (arg: {
        id: string;
        cloudHost: string;
        version: string;
    }) => Promise<void>;
    'Desktop.getAdminIdentities': () => {
        datastoresById: {
            [id: string]: string;
        };
        cloudsByName: {
            [name: string]: string;
        };
    };
    'Desktop.getCloudConnections': () => ICloudConnected[];
    'Desktop.connectToPrivateCloud': (arg: {
        address: string;
        name: string;
        adminIdentityPath?: string;
    }) => Promise<void>;
    'GettingStarted.getCompletedSteps': () => string[];
    'GettingStarted.completeStep': (step: string) => Promise<void>;
    'Session.openReplay': (arg: IOpenReplay) => void;
    'User.getQueries': () => IQueryLogEntry[];
    'User.getBalance': () => Promise<IUserBalance>;
};
export interface IOpenReplay {
    cloudAddress: string;
    heroSessionId: string;
    dbPath: string;
}
export declare type IChromeAliveSessionApiResponse<T extends keyof IChromeAliveSessionApis> = ICoreResponsePayload<IChromeAliveSessionApis, T>;
