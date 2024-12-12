import CloudNode from '@ulixee/cloud';
import type { IDatastorePaymentRecipient } from '@ulixee/platform-specification/types/IDatastoreManifest';
import * as http from 'http';
import KoaMulter = require('@koa/multer');
import KoaRouter = require('@koa/router');
import Koa = require('koa');
export declare function blockGlobalConfigWrites(): void;
export declare const needsClosing: {
    close: () => Promise<any> | void;
    onlyCloseOnFinal?: boolean;
}[];
export declare function createLocalNode(config: ConstructorParameters<typeof CloudNode>[0], onlyCloseOnFinal?: boolean, paymentInfo?: IDatastorePaymentRecipient): Promise<CloudNode>;
export declare function onClose(closeFn: (() => Promise<any>) | (() => any), onlyCloseOnFinal?: boolean): void;
export interface ITestKoaServer extends KoaRouter {
    close: () => void;
    server: http.Server;
    koa: Koa;
    isClosing?: boolean;
    onlyCloseOnFinal?: boolean;
    baseHost: string;
    baseUrl: string;
    upload: KoaMulter.Instance;
}
export declare function runKoaServer(onlyCloseOnFinal?: boolean): Promise<ITestKoaServer>;
export declare function afterEach(): Promise<void>;
export declare function afterAll(): Promise<void>;
