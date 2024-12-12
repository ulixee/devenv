export default class TestDatabroker {
    #private;
    private rootDir;
    address: string;
    adminAddress: string;
    constructor(rootDir?: string);
    start(envArgs: {
        ULX_DATABROKER_DIR?: string;
        ULX_DATABROKER_PORT?: string;
        ARGON_MAINCHAIN_URL?: string;
        ARGON_LOCALCHAIN_PATH?: string;
    }): Promise<string>;
    close(): Promise<void>;
    whitelistDomain(domain: string): Promise<void>;
    registerUser(identityPath: string, amount: bigint): Promise<void>;
    getBalance(identity: string): Promise<bigint>;
}
