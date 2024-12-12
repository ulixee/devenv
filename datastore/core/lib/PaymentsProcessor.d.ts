import Datastore from '@ulixee/datastore';
import { IPayment } from '@ulixee/platform-specification';
import { IDatastoreMetadataResult } from '@ulixee/platform-specification/datastore/DatastoreApis';
import IDatastoreManifest from '@ulixee/platform-specification/types/IDatastoreManifest';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
/**
 * 50 microgons for 1KB means:
 * 1 microgons per 20.5 bytes
 * 1MB is $0.05
 * 1GB is $52.43
 *
 * Proxy services can be 1.2c per mb base price (but that's for all page contents)
 *  ie, 12k microgons, ie, 12 microgons per kb
 *
 */
export default class PaymentsProcessor {
    private payment;
    private datastoreId;
    private datastore;
    readonly context: Pick<IDatastoreApiContext, 'configuration' | 'argonPaymentProcessor'>;
    initialPrice: bigint;
    talliedPrice: bigint;
    private shouldFinalize;
    constructor(payment: IPayment, datastoreId: string, datastore: Datastore, context: Pick<IDatastoreApiContext, 'configuration' | 'argonPaymentProcessor'>);
    debit(queryId: string, manifest: IDatastoreManifest, entityCalls: string[]): Promise<boolean>;
    trackCallResult(_call: string, microgons: bigint, upstreamResult?: IDatastoreMetadataResult): bigint;
    storageEngineResult(result: IDatastoreMetadataResult): void;
    finalize(_bytes: number): Promise<bigint>;
}
