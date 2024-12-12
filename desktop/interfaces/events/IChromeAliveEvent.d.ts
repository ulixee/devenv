import IDesktopAppEvents from './IDesktopAppEvents';
import IChromeAliveSessionEvents from './IChromeAliveSessionEvents';
export default interface IChromeAliveEvent<TEvents = IChromeAliveSessionEvents | IDesktopAppEvents, T extends keyof TEvents = keyof TEvents> {
    eventType: T;
    data: TEvents[T];
}
