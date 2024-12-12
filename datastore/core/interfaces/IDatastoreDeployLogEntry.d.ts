export default interface IDatastoreDeployLogEntry {
    scriptEntrypoint: string;
    cloudHost: string;
    datastoreId: string;
    version: string;
    timestamp: number;
    adminIdentity?: string;
}
