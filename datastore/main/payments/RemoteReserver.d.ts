import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { ConnectionToCore } from '@ulixee/net';
import { IPayment } from '@ulixee/platform-specification';
import { IPaymentServiceApis } from '@ulixee/platform-specification/datastore';
import IPaymentServiceApiTypes from '@ulixee/platform-specification/datastore/PaymentServiceApis';
import Identity from '@ulixee/platform-utils/lib/Identity';
import { IPaymentEvents, IPaymentReserver } from '../interfaces/IPaymentService';
export default class RemoteReserver extends TypedEventEmitter<IPaymentEvents> implements IPaymentReserver {
    readonly connectionToCore: ConnectionToCore<IPaymentServiceApis, {}>;
    private authenticationToken;
    constructor(connectionToCore: ConnectionToCore<IPaymentServiceApis, {}>);
    authenticate(identity: Identity): Promise<void>;
    close(): Promise<void>;
    reserve(info: IPaymentServiceApiTypes['PaymentService.reserve']['args']): Promise<IPayment>;
    finalize(info: IPaymentServiceApiTypes['PaymentService.finalize']['args']): Promise<void>;
    static getMessage(identity: string, nonce: string): Buffer;
}
