import { KeyringPair, ArgonClient, ArgonPrimitivesDomainVersionHost } from '@argonprotocol/mainchain';
import TestNotary from './TestNotary';
export default class TestMainchain {
    #private;
    ip: string;
    port: string;
    loglevel: string;
    containerName?: string;
    proxy?: string;
    get address(): string;
    constructor(binPath?: string);
    /**
     * Launch and return the localhost url. NOTE: this url will not work cross-docker. You need to use the containerAddress property
     * @param miningThreads
     */
    launch(miningThreads?: number): Promise<string>;
    teardown(): Promise<void>;
    private startBitcoin;
}
export declare function registerZoneRecord(client: ArgonClient, domainHash: Uint8Array, owner: KeyringPair, paymentAccount: Uint8Array, notaryId: number, versions: Record<string, ArgonPrimitivesDomainVersionHost>): Promise<void>;
export declare function activateNotary(sudo: KeyringPair, client: ArgonClient, notary: TestNotary): Promise<void>;
