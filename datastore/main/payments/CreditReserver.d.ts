import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { IPayment } from '@ulixee/platform-specification';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
import { IPaymentMethod } from '@ulixee/platform-specification/types/IPayment';
import IDatastoreHostLookup from '../interfaces/IDatastoreHostLookup';
import { ICredit, IPaymentDetails, IPaymentEvents, IPaymentReserver } from '../interfaces/IPaymentService';
export default class CreditReserver extends TypedEventEmitter<IPaymentEvents> implements IPaymentReserver {
    private baseDir;
    static MIN_BALANCE: number;
    static defaultBasePath: string;
    get datastoreId(): string;
    get credit(): ICredit;
    paymentDetails: IPaymentDetails;
    storePath: string;
    private isClosed;
    private readonly saveDebounce;
    private queue;
    private paymentsPendingFinalization;
    constructor(credit: IPaymentDetails, baseDir: string);
    getPaymentInfo(): Promise<IDatastorePaymentRecipient | undefined>;
    hasBalance(microgons: bigint): boolean;
    reserve(paymentInfo: IPaymentServiceApiTypes['PaymentService.reserve']['args']): Promise<IPayment>;
    canFinalize(uuid: string): boolean;
    finalize(paymentInfo: IPaymentServiceApiTypes['PaymentService.finalize']['args']): Promise<void>;
    close(): Promise<void>;
    save(canDelete?: boolean): Promise<void>;
    private writeToDisk;
    static loadAll(fromDir?: string): Promise<CreditReserver[]>;
    static load(datastoreId: string, creditId: string, fromDir?: string): Promise<CreditReserver>;
    static storeCredit(datastoreId: string, datastoreVersion: string, host: string, credits: {
        id: string;
        secret: string;
        remainingCredits: bigint;
    }, creditsDir?: string): Promise<CreditReserver>;
    static lookup(datastoreUrl: string, credit: IPaymentMethod['credits'], datastoreLookup?: IDatastoreHostLookup, creditsDir?: string): Promise<CreditReserver>;
    static storeCreditFromUrl(url: string, microgons: bigint, datastoreLookup?: IDatastoreHostLookup): Promise<CreditReserver>;
}
