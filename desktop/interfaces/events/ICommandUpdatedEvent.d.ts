import type ISourceCodeLocation from '@ulixee/commons/interfaces/ISourceCodeLocation';
import type ICommandWithResult from '@ulixee/hero-core/interfaces/ICommandWithResult';
export default interface ICommandUpdatedEvent {
    command: ICommandWithResult;
    isComplete: boolean;
    originalSourcePosition: ISourceCodeLocation[];
}
