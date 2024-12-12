import ConnectionToDatastoreCore from './ConnectionToDatastoreCore';
export default class ConnectionFactory {
    static hasLocalCloudPackage: boolean;
    static createConnection(): ConnectionToDatastoreCore;
}
