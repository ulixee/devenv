import { Localchain } from '@argonprotocol/localchain';
type ILocalchainRef = Pick<Localchain, 'accounts' | 'transactions' | 'ticker' | 'openChannelHolds' | 'accountOverview' | 'address'>;
/**
 * This is a wrapper interface simply indicating that a Localchain instance has sync being managed
 */
export default ILocalchainRef;
