declare global {
    interface Window {
        DevtoolsBackdoor: typeof DevtoolsBackdoor;
    }
}
declare class DevtoolsBackdoor {
    static inspectElementModeIsActive: boolean;
    static getInspectedTabId(timeoutMs?: number): Promise<number>;
    static showConsolePanel(): void;
    static showElementsPanel(): void;
    static showHeroScriptPanel(): void;
    static showStateGeneratorPanel(): void;
    static closeDevtools(): void;
    static toggleInspectElementMode(InspectorFrontendAPI?: any): boolean;
    static searchDom(query: string): Promise<any>;
    static revealNodeInElementsPanel(backendNodeId: string): Promise<void>;
}
export {};
