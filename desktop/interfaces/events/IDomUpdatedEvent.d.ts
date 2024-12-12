import { IFrontendDomChangeEvent } from '@ulixee/hero-interfaces/IDomChangeEvent';
export default interface IDomUpdatedEvent {
    paintEvents: IFrontendDomChangeEvent[][];
    framesById: {
        [id: number]: {
            parentId: number;
            domNodeId: number;
        };
    };
}
