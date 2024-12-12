export interface IDatabrokerAuthAccount {
    host: string;
    userIdentity: string;
    name?: string;
    pemPath: string;
    pemPassword?: string;
}
interface ILocalUserProfile {
    clouds: {
        address: string;
        adminIdentityPath?: string;
        name: string;
    }[];
    installedDatastores: {
        cloudHost: string;
        datastoreId: string;
        datastoreVersion: string;
    }[];
    gettingStartedCompletedSteps: string[];
    datastoreAdminIdentities: {
        datastoreId: string;
        adminIdentityPath?: string;
    }[];
    defaultAdminIdentityPath: string;
    localchains: {
        path: string;
        hasPassword: boolean;
    }[];
    localchainForQueryName: string;
    localchainForCloudNodeName: string;
    databrokers: IDatabrokerAuthAccount[];
}
export default ILocalUserProfile;
export { ILocalUserProfile };
