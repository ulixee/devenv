import ILocalchainConfig from '@ulixee/datastore/interfaces/ILocalchainConfig';
export default interface IDatabrokerCoreConfigureOptions {
    storageDir: string;
    localchainConfig?: ILocalchainConfig;
}
