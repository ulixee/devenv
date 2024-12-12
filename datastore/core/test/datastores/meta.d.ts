import Datastore from '@ulixee/datastore';
import IDatastoreMetadata from '@ulixee/datastore/interfaces/IDatastoreMetadata';
declare class TestDatastore extends Datastore {
    get metadata(): IDatastoreMetadata;
}
declare const _default: TestDatastore;
export default _default;
