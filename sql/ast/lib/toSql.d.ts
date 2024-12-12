import { ReplaceReturnType } from './utils';
import IAstPartialMapper from '../interfaces/IAstPartialMapper';
export type IAstToSql = {
    readonly [key in keyof IAstPartialMapper]-?: ReplaceReturnType<IAstPartialMapper[key], string>;
};
export declare const toSql: IAstToSql;
