import { ConnectionToCore } from '@ulixee/net';
import ICoreEventPayload from '@ulixee/net/interfaces/ICoreEventPayload';
import { IPayment } from '@ulixee/platform-specification';
import { IDatastoreApis, IDatastoreApiTypes, IChannelHoldApis, IChannelHoldEvents } from '@ulixee/platform-specification/datastore';
import { IDatastoreQueryResult } from '@ulixee/platform-specification/datastore/DatastoreApis';
import IChannelHoldApiTypes from '@ulixee/platform-specification/datastore/ChannelHoldApis';
import IBalanceChange from '@ulixee/platform-specification/types/IBalanceChange';
import Identity from '@ulixee/platform-utils/lib/Identity';
import IDatastoreEvents from '../interfaces/IDatastoreEvents';
import { IDatastoreHost } from '../interfaces/IDatastoreHostLookup';
import IItemInputOutput from '../interfaces/IItemInputOutput';
import IPaymentService from '../interfaces/IPaymentService';
import { IQueryOptionsWithoutId } from '../interfaces/IQueryOptions';
import ITypes from '../types';
import DatastorePricing from './PricingManager';
import ResultIterable from './ResultIterable';
export type IDatastoreExecRelayArgs = Pick<IDatastoreApiTypes['Datastore.query']['args'], 'authentication' | 'payment'>;
export type IDatastoreMeta = IDatastoreApiTypes['Datastore.meta']['result'];
export default class DatastoreApiClient {
    connectionToCore: ConnectionToCore<IDatastoreApis & IChannelHoldApis, IDatastoreEvents & IChannelHoldEvents>;
    host: string;
    validateApiParameters: boolean;
    pricing: DatastorePricing;
    protected activeStreamByQueryId: Map<string, ResultIterable<any, any>>;
    private manifestByDatastoreUrl;
    private options;
    private queryLog;
    constructor(host: string, options?: {
        consoleLogErrors?: boolean;
        storeQueryLog?: boolean;
    });
    disconnect(): Promise<void>;
    getMetaAndSchema(id: string, version: string): Promise<IDatastoreMeta>;
    registerChannelHold(datastoreId: string, balanceChange: IBalanceChange): Promise<{
        accepted: boolean;
    }>;
    getMeta(id: string, version: string): Promise<IDatastoreMeta>;
    install(id: string, version: string, alias?: string): Promise<IDatastoreMeta>;
    /**
     * NOTE: any caller must handle tracking local balances of Credits and removing them if they're depleted!
     */
    stream<IO extends IItemInputOutput, IVersion extends keyof ITypes & string = any, IItemName extends keyof ITypes[IVersion]['extractors'] & string = string, ISchemaDbx extends ITypes[IVersion]['extractors'][IItemName] = IO>(id: string, version: IVersion, name: IItemName, input: ISchemaDbx['input'], options?: IQueryOptionsWithoutId & {
        paymentService?: IPaymentService;
    }): ResultIterable<ISchemaDbx['output'], IDatastoreApiTypes['Datastore.stream']['result']>;
    /**
     * NOTE: any caller must handle tracking local balances of Credits and removing them if they're depleted!
     */
    query<ISchemaOutput = any, IVersion extends keyof ITypes & string = any>(id: string, version: IVersion, sql: string, options?: IQueryOptionsWithoutId & {
        paymentService?: IPaymentService;
        boundValues?: any[];
    }): Promise<IDatastoreQueryResult & {
        outputs?: ISchemaOutput[];
        queryId: string;
    }>;
    upload(compressedDbx: Buffer, options?: {
        timeoutMs?: number;
        identity?: Identity;
        forwardedSignature?: {
            adminIdentity: string;
            adminSignature: Buffer;
        };
    }): Promise<{
        success: boolean;
    }>;
    download(id: string, version: string, identity: Identity, options?: {
        timeoutMs?: number;
    }): Promise<IDatastoreApiTypes['Datastore.download']['result']>;
    startDatastore(id: string, dbxPath: string, watch?: boolean): Promise<{
        success: boolean;
    }>;
    getCreditsBalance(id: string, version: string, creditId: string): Promise<IDatastoreApiTypes['Datastore.creditsBalance']['result']>;
    createCredits(id: string, version: string, microgons: number | bigint, adminIdentity: Identity): Promise<{
        id: string;
        remainingCredits: bigint;
        secret: string;
    }>;
    administer<T>(id: string, version: string, adminIdentity: Identity, adminFunction: {
        ownerType: 'datastore' | 'crawler' | 'extractor' | 'table';
        ownerName: string;
        functionName: string;
    }, functionArgs: any[]): Promise<T>;
    request<T extends keyof IDatastoreApiTypes & string>(command: T, args: IDatastoreApiTypes[T]['args'], timeoutMs?: number): Promise<IDatastoreApiTypes[T]['result']>;
    protected onEvent<T extends keyof IDatastoreEvents>(evt: {
        event: ICoreEventPayload<IDatastoreEvents, T>;
    }): void;
    protected runApi<T extends keyof IChannelHoldApiTypes & string>(command: T, args: IChannelHoldApiTypes[T]['args'], timeoutMs?: number): Promise<IChannelHoldApiTypes[T]['result']>;
    protected runApi<T extends keyof IDatastoreApiTypes & string>(command: T, args: IDatastoreApiTypes[T]['args'], timeoutMs?: number): Promise<IDatastoreApiTypes[T]['result']>;
    static lookupDatastoreHost(datastoreUrl: string, argonMainchainUrl: string): Promise<IDatastoreHost>;
    static createExecSignatureMessage(payment: IPayment, nonce: string): Buffer;
    static createExecAuthentication(payment: IPayment, authenticationIdentity: Identity, nonce?: string): IDatastoreExecRelayArgs['authentication'];
    static createAdminFunctionMessage(datastoreId: string, adminIdentity: string, ownerType: string, ownerName: string, functionName: string, args: any[]): Buffer;
    static createUploadSignatureMessage(compressedDbx: Buffer): Buffer;
    static createDownloadSignatureMessage(id: string, version: string, requestDate: number): Buffer;
}
