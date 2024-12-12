import { IPayment } from '@ulixee/platform-specification';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import IDatastoreHostLookup from '../interfaces/IDatastoreHostLookup';
import IDatastoreMetadata from '../interfaces/IDatastoreMetadata';
import DefaultPaymentService from './DefaultPaymentService';
/**
 * A Payment service meant to be embedded - includes a whitelist of upstream datastores
 */
export default class EmbeddedPaymentService extends DefaultPaymentService {
    /**
     * Security feature to enable only specific datastores to create channelHolds.
     *
     * Key is host_id
     */
    private whitelistedDatastoreIds;
    /**
     * Indicates which datastores have been loaded into the IPaymentService['whitelistRemotes'] call
     */
    private loadedDatastoreIds;
    whitelistRemotes(manifest: IDatastoreMetadata, datastoreLookup: IDatastoreHostLookup): Promise<void>;
    reserve(info: IPaymentServiceApiTypes['PaymentService.reserve']['args']): Promise<IPayment>;
}
