import { IInterval } from '../../interfaces/ISqlNode';
type E = [keyof IInterval, number];
type K = E | K[];
export declare function buildInterval(orig: string, vals: 'invalid' | K): IInterval;
/** Returns a normalized copy of the given interval */
export declare function normalizeInterval(value: IInterval): IInterval;
/** Interval value to postgres string representation  */
export declare function intervalToString(value: IInterval): string;
export {};
