export interface ISelectorMap {
    target: ITarget;
    ancestors: ITarget[];
    topMatches: string[];
    nodePath: string;
}
interface ITarget {
    heroNodeId: number;
    selectorOptions: ISelectorOption[];
}
export interface ISelectorOption {
    type: 'index' | 'id' | 'tag' | 'class' | 'attr';
    rank: number;
    value: string;
    valueAsOnlyOption?: string;
    domMatches: number;
}
export {};
