import { IDatastoreApiTypes } from '@ulixee/platform-specification/datastore';
import Datastore from '@ulixee/datastore';
import { IPayment } from '@ulixee/platform-specification';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
export declare function validateFunctionCoreVersions(registryEntry: IDatastoreManifest, extractorName: string, context: IDatastoreApiContext): void;
export declare function validateAuthentication(datastore: Datastore, payment: IPayment, authentication: IDatastoreApiTypes['Datastore.query']['args']['authentication']): Promise<void>;
