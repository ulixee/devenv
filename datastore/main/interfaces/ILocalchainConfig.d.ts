import { KeystorePasswordOption } from '@argonprotocol/localchain';
import { IChannelHoldAllocationStrategy } from '../payments/ArgonReserver';
export default interface ILocalchainConfig {
    mainchainUrl?: string;
    notaryId?: number;
    /**
     * Load a localchain by it's full path (eg, /path/to/filename.db)
     */
    localchainPath?: string;
    /**
     * Load a localchain from the default localchain directory by it's name (eg, 'localchain1')
     */
    localchainName?: string;
    /**
     * Create a localchain if it doesn't exist
     */
    localchainCreateIfMissing?: boolean;
    /**
     * Strategy to use to create channelHolds. Defaults to a 100 query multiplier
     */
    channelHoldAllocationStrategy?: IChannelHoldAllocationStrategy;
    /**
     * Must be set to enable block vote creation. This is the address where block rewards will be sent.
     */
    blockRewardsAddress?: string;
    /**
     * A password, if applicable, to the localchain
     */
    keystorePassword?: KeystorePasswordOption;
    /**
     * Should sync be run automatically, or wait for programmatic execution (default false)
     */
    disableAutomaticSync?: boolean;
}
