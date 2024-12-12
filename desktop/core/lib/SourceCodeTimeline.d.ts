import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import ICommandUpdatedEvent from '@ulixee/desktop-interfaces/events/ICommandUpdatedEvent';
import ISourceCodeUpdatedEvent from '@ulixee/desktop-interfaces/events/ISourceCodeUpdatedEvent';
import { Session } from '@ulixee/hero-core';
import ICommandMeta from '@ulixee/hero-interfaces/ICommandMeta';
export default class SourceCodeTimeline extends TypedEventEmitter<{
    source: ISourceCodeUpdatedEvent;
    command: ICommandUpdatedEvent;
}> {
    readonly entrypoint: string;
    private sourceFileLines;
    private events;
    private commandsById;
    constructor(entrypoint: string, datastoresDir: string);
    listen(heroSession: Session): void;
    loadCommands(commands: ICommandMeta[]): void;
    getCurrentState(): {
        commandsById: Record<number, ICommandUpdatedEvent>;
        sourceFileLines: Record<string, string[]>;
    };
    close(): void;
    clearCache(): void;
    private onCommandStart;
    private onCommandFinished;
    private checkForSourceUpdates;
    private filterDesktopPaths;
}
