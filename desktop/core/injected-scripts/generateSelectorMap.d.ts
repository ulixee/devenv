import type { ISelectorOption } from '@ulixee/desktop-interfaces/ISelectorMap';
interface ITarget {
    element: Element;
    heroNodeId: number;
    selectorOptions: ISelectorOption[];
}
type IAncestors = ITarget[];
type Bitmask = bigint;
export interface ISelectorMapContext {
    target: ITarget;
    ancestors: IAncestors;
    boundary: ParentNode;
    nodePath: string;
    selectors: {
        targetBitmask: Bitmask;
        ancestorBitmasks: Bitmask[];
        rank: number;
        selector: string;
    }[];
}
/**
 * Ancestor patterns are just bitmasks of the Permutations 2^<ancestor length> -1. 2 = ['11','01','10'] = [3,1,2]
 * Selector options are also just bitmasks of available options 2^[options.length] -1.
 * Start at current element - check for any unique patterns.
 * Count querySelectorAll to see if there's exactly 1 matching element
 */
export default function generateSelectorMap(element: Element, boundary?: ParentNode, iterationsBeforeFirstBreak?: number): ISelectorMapContext;
export declare function decodeBitmask<T>(bitmask: Bitmask, options: T[]): T[];
export declare function decodeBitmaskIndexes<T>(bitmask: Bitmask, options: T[]): number[];
export declare function getMaxBitmaskValue<T>(options: T[]): Bitmask;
export {};
