import IDatastoreOutputEvent from '../events/IDatastoreOutputEvent';
import IDatastoreCollectedAssets from '../IDatastoreCollectedAssets';
export default interface IDatastoreApi {
    getOutput(): IDatastoreOutputEvent;
    getCollectedAssets(): Promise<IDatastoreCollectedAssets>;
    rerunExtractor(): Promise<{
        success: boolean;
        error?: Error;
    }>;
}
