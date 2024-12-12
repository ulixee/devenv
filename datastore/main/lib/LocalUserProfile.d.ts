import Identity from '@ulixee/platform-utils/lib/Identity';
import ILocalUserProfile from '../interfaces/ILocalUserProfile';
export default class LocalUserProfile implements ILocalUserProfile {
    #private;
    static path: string;
    clouds: (ILocalUserProfile['clouds'][0] & {
        adminIdentity?: string;
    })[];
    databrokers: ILocalUserProfile['databrokers'];
    localchains: ILocalUserProfile['localchains'];
    localchainForQueryName: string;
    localchainForCloudNodeName: string;
    installedDatastores: ILocalUserProfile['installedDatastores'];
    datastoreAdminIdentities: (ILocalUserProfile['datastoreAdminIdentities'][0] & {
        adminIdentity?: string;
    })[];
    gettingStartedCompletedSteps: string[];
    defaultAdminIdentityPath: string;
    get defaultAdminIdentity(): Identity;
    constructor();
    setDatastoreAdminIdentity(datastoreId: string, adminIdentityPath: string): Promise<string>;
    setCloudAdminIdentity(cloudName: string, adminIdentityPath: string): Promise<string>;
    getAdminIdentity(datastoreId: string, cloudName: string): Identity;
    createDefaultAdminIdentity(): Promise<string>;
    installDatastore(cloudHost: string, datastoreId: string, datastoreVersion: string): Promise<void>;
    uninstallDatastore(cloudHost: string, datastoreId: string, datastoreVersion: string): Promise<void>;
    save(): Promise<void>;
    toJSON(): ILocalUserProfile;
    private loadProfile;
}
