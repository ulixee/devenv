import IParseOptions from '../interfaces/IParseOptions';
import { IBox, ICircle, IExpr, IInterval, ILine, IPath, IPoint, IPolygon, IQName, ISegment, ISqlComment, IStatement } from '../interfaces/ISqlNode';
/** Parse the first SQL statement in the given text (discards the rest), and return its AST */
export declare function parseFirst(sql: string): IStatement;
/** Parse an AST from SQL, and get the comments */
export declare function parseWithComments(sql: string, options?: IParseOptions): {
    ast: IStatement[];
    comments: ISqlComment[];
};
/** Parse an AST from SQL */
export declare function parse(sql: string): IStatement[];
export declare function parse(sql: string, entry: 'expr'): IExpr;
export declare function parse(sql: string, entry: 'qualified_name'): IQName;
export declare function parse(sql: string, options?: IParseOptions): IStatement[];
export declare function parseArrayLiteral(sql: string): string[];
export declare function parseIntervalLiteral(literal: string): IInterval;
export declare function parseGeometricLiteral(sql: string, type: 'point'): IPoint;
export declare function parseGeometricLiteral(sql: string, type: 'line'): ILine;
export declare function parseGeometricLiteral(sql: string, type: 'lseg'): ISegment;
export declare function parseGeometricLiteral(sql: string, type: 'box'): IBox;
export declare function parseGeometricLiteral(sql: string, type: 'path'): IPath;
export declare function parseGeometricLiteral(sql: string, type: 'polygon'): IPolygon;
export declare function parseGeometricLiteral(sql: string, type: 'circle'): ICircle;
