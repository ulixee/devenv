import { ChannelHold } from '@argonprotocol/localchain';
import IBalanceChange from '@ulixee/platform-specification/types/IBalanceChange';
export default class MockArgonPaymentProcessor {
    canSign: jest.SpyInstance<any, unknown[], any>;
    updateSettlement: jest.SpyInstance<any, unknown[], any>;
    importToLocalchain: jest.SpyInstance<any, unknown[], any>;
    timeForTick: jest.SpyInstance<any, unknown[], any>;
    clear(): void;
    mock(onImport: (datastoreId: string, channelHold: IBalanceChange) => Pick<ChannelHold, 'id' | 'expirationTick' | 'holdAmount'>): void;
}
