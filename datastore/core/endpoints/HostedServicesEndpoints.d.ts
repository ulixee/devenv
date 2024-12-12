import { IAsyncFunc } from '@ulixee/net/interfaces/IApiHandlers';
import ITransport from '@ulixee/net/interfaces/ITransport';
import ConnectionToClient from '@ulixee/net/lib/ConnectionToClient';
import { IDomainLookupApis, IPaymentServiceApis } from '@ulixee/platform-specification/datastore';
import { IArgonPaymentProcessorApis } from '@ulixee/platform-specification/services/ArgonPaymentProcessorApis';
import { IDatastoreRegistryApis } from '@ulixee/platform-specification/services/DatastoreRegistryApis';
import { IStatsTrackerApis } from '@ulixee/platform-specification/services/StatsTrackerApis';
import { IZodApiTypes } from '@ulixee/platform-specification/utils/IZodApi';
import IDatastoreApiContext from '../interfaces/IDatastoreApiContext';
export type TServicesApis = IDatastoreRegistryApis<IDatastoreApiContext> & IStatsTrackerApis<IDatastoreApiContext> & IPaymentServiceApis<IDatastoreApiContext> & IArgonPaymentProcessorApis<IDatastoreApiContext> & IDomainLookupApis<IDatastoreApiContext>;
export type TConnectionToServicesClient = ConnectionToClient<TServicesApis, {}>;
export default class HostedServicesEndpoints {
    connections: Set<TConnectionToServicesClient>;
    private readonly handlersByCommand;
    constructor();
    addConnection(transport: ITransport, context: IDatastoreApiContext): TConnectionToServicesClient;
}
export declare function validateThenRun(api: string, handler: IAsyncFunc, validationSchema: IZodApiTypes | undefined, args: any, context: IDatastoreApiContext): Promise<any>;
