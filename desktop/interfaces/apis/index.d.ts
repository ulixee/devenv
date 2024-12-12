import type { LocalchainOverview } from '@argonprotocol/localchain';
import type { IDatabrokerAuthAccount, ILocalUserProfile } from '@ulixee/datastore/interfaces/ILocalUserProfile';
import type { IDatabrokerAccount, IWallet } from '@ulixee/datastore/interfaces/IPaymentService';
import type IQueryLogEntry from '@ulixee/datastore/interfaces/IQueryLogEntry';
import type ICoreResponsePayload from '@ulixee/net/interfaces/ICoreResponsePayload';
import { IDatastoreApis, IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import IArgonFile from '@ulixee/platform-specification/types/IArgonFile';
import IAppApi from './IAppApi';
import IChromeAliveSessionApi from './IChromeAliveSessionApi';
import IDatastoreApi from './IDatastoreApi';
import { ICloudConnected } from './IDesktopApis';
import IDevtoolsBackdoorApi from './IDevtoolsBackdoorApi';
import IHeroSessionsApi from './IHeroSessionsApi';
export type IChromeAliveSessionApis = {
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
export type IDesktopAppApis = {
    'App.connect': IAppApi['connect'];
    'Sessions.search': IHeroSessionsApi['search'];
    'Sessions.list': IHeroSessionsApi['list'];
    'Datastores.list': IDatastoreApis['Datastores.list'];
    'Datastore.meta': IDatastoreApis['Datastore.meta'];
    'Datastore.stats': IDatastoreApis['Datastore.stats'];
    'Datastore.versions': IDatastoreApis['Datastore.versions'];
    'Datastore.creditsIssued': IDatastoreApis['Datastore.creditsIssued'];
};
export type IDatastoreResultItem = IDatastoreApiTypes['Datastores.list']['result']['datastores'][0];
export type TCredit = IArgonFile['credit'];
export type IArgonFileMeta = {
    file: IArgonFile;
    name: string;
    rawJson: string;
};
export type IDesktopAppPrivateApis = {
    'Argon.send': (arg: {
        microgons: bigint;
        toAddress?: string;
        fromAddress?: string;
    }) => Promise<IArgonFileMeta>;
    'Argon.request': (arg: {
        microgons: bigint;
        sendToMyAddress?: string;
    }) => Promise<IArgonFileMeta>;
    'Argon.importSend': (arg: {
        argonFile: IArgonFile;
        claimWithAddress?: string;
    }) => Promise<void>;
    'Argon.acceptRequest': (arg: {
        argonFile: IArgonFile;
        fundWithAddress?: string;
    }) => Promise<void>;
    'Argon.transferFromMainchain': (arg: {
        address: string;
        microgons: bigint;
    }) => Promise<void>;
    'Argon.transferToMainchain': (arg: {
        address: string;
        microgons: bigint;
    }) => Promise<void>;
    'Argon.dropFile': (path: string) => Promise<void>;
    'Argon.showFileContextMenu': (args: IArgonFileMeta & {
        position: {
            x: number;
            y: number;
        };
    }) => Promise<void>;
    'Credit.create': (args: {
        datastore: Pick<IDatastoreResultItem, 'id' | 'version' | 'name' | 'scriptEntrypoint'>;
        cloud: string;
        argons: number;
    }) => Promise<IArgonFileMeta>;
    'Credit.save': (arg: {
        credit: IArgonFile['credit'];
    }) => Promise<void>;
    'Cloud.findAdminIdentity': (cloudName: string) => Promise<string | null>;
    'Datastore.setAdminIdentity': (datastoreId: string, adminIdentityPath: string) => Promise<string>;
    'Datastore.findAdminIdentity': (datastoreId: string) => Promise<string | null>;
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
    'User.getWallet': () => Promise<IWallet>;
    'User.createAccount': (args: {
        name: string;
        suri?: string;
        password?: string;
    }) => Promise<LocalchainOverview>;
    'User.addBrokerAccount': (args: Omit<IDatabrokerAuthAccount, 'userIdentity'>) => Promise<IDatabrokerAccount>;
};
export interface IOpenReplay {
    cloudAddress: string;
    heroSessionId: string;
    dbPath: string;
}
export type IChromeAliveSessionApiResponse<T extends keyof IChromeAliveSessionApis> = ICoreResponsePayload<IChromeAliveSessionApis, T>;
