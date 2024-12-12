import IDatastoreOutputEvent from './IDatastoreOutputEvent';
import IHeroSessionUpdatedEvent from './IHeroSessionUpdatedEvent';
import IDomStateUpdateEvent from './IDomStateUpdatedEvent';
import ISessionAppModeEvent from './ISessionAppModeEvent';
import ICommandUpdatedEvent from './ICommandUpdatedEvent';
import ISourceCodeUpdatedEvent from './ISourceCodeUpdatedEvent';
import ICommandFocusedEvent from './ICommandFocusedEvent';
import IDomFocusEvent from './IDomFocusEvent';
import IDomUpdatedEvent from './IDomUpdatedEvent';
import ISessionTimetravelEvent from './ISessionTimetravelEvent';
import IInterceptInspectElementMode from './IInterceptInspectElementMode';
import IDatastoreCollectedAssetEvent from './IDatastoreCollectedAssetEvent';
import IElementSummary from '../IElementSummary';
import IResourceOverview from '../IResourceOverview';
export default interface IChromeAliveSessionEvents {
    'Session.tabCreated': {
        tabId: number;
    };
    'Session.appMode': ISessionAppModeEvent;
    'Session.closed': void;
    'Session.loading': void;
    'Session.loaded': void;
    'Session.updated': IHeroSessionUpdatedEvent;
    'Session.resource': {
        resource: IResourceOverview;
    };
    'Session.timetravel': ISessionTimetravelEvent;
    'Session.interceptInspectElementMode': IInterceptInspectElementMode;
    'Datastore.output': IDatastoreOutputEvent;
    'Datastore.collected-asset': IDatastoreCollectedAssetEvent;
    'Dom.updated': IDomUpdatedEvent;
    'Dom.focus': IDomFocusEvent;
    'DomState.updated': IDomStateUpdateEvent;
    'Command.updated': ICommandUpdatedEvent;
    'Command.focused': ICommandFocusedEvent;
    'SourceCode.updated': ISourceCodeUpdatedEvent;
    'DevtoolsBackdoor.toggleInspectElementMode': {
        isActive: boolean;
    };
    'DevtoolsBackdoor.elementWasSelected': {
        element: IElementSummary;
    };
}
