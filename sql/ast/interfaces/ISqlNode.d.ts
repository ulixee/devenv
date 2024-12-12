import INil from './INil';
export type IStatement = ISelectStatement | IInsertStatement | IUpdateStatement | IDeleteStatement | ICommentStatement | IValuesStatement;
export default interface ISqlNode {
    _location?: INodeLocation;
}
export interface ISqlComment extends ISqlNode {
    comment: string;
}
export interface IReturnsTable extends ISqlNode {
    kind: 'table';
    columns: {
        name: IName;
        type: IDataTypeDef;
    }[];
}
export type IFunctionArgumentMode = 'in' | 'out' | 'inout' | 'variadic';
export interface IFunctionArgument extends ISqlNode {
    name?: IName;
    type: IDataTypeDef;
    default?: IExpr;
    mode?: IFunctionArgumentMode;
}
export interface ICommentStatement extends ISqlNode {
    type: 'comment';
    comment: string;
    /** This is not exhaustive compared to https://www.postgresql.org/docs/13/sql-comment.html
     * But this is what's supported. File an issue if you want more.
     */
    on: {
        type: 'table' | 'database' | 'index' | 'trigger' | 'type' | 'view';
        name: IQName;
    } | {
        type: 'column';
        column: IQColumn;
    };
}
export interface ICompositeTypeAttribute extends ISqlNode {
    name: IName;
    dataType: IDataTypeDef;
    collate?: IName;
}
export interface ILiteral extends ISqlNode {
    value: string;
}
export interface INodeLocation {
    /** Location of the last ";" prior to this statement */
    start: number;
    /** Location of the first ";" after this statement (if any) */
    end: number;
}
export interface IDeleteStatement extends ISqlNode {
    type: 'delete';
    from: IQNameAliased;
    returning?: ISelectedColumn[] | INil;
    where?: IExpr | INil;
}
export interface IInsertStatement extends ISqlNode {
    type: 'insert';
    into: IQNameAliased;
    returning?: ISelectedColumn[] | INil;
    columns?: IName[] | INil;
    overriding?: 'system' | 'user';
    insert: ISelectStatement;
}
export interface IIndexExpression extends ISqlNode {
    expression: IExpr;
    opclass?: IQName;
    collate?: IQName;
    order?: 'asc' | 'desc';
    nulls?: 'first' | 'last';
}
export interface IName extends ISqlNode {
    name: string;
}
export interface ITableAliasName extends IName, ISqlNode {
    columns?: IName[];
}
export interface IQName extends IName, ISqlNode {
    schema?: string;
}
export interface IQColumn extends ISqlNode {
    table: string;
    column: string;
    schema?: string;
}
export type IDataTypeDef = IArrayDataTypeDef | IBasicDataTypeDef;
export interface IArrayDataTypeDef extends ISqlNode {
    kind: 'array';
    arrayOf: IDataTypeDef;
}
export interface IBasicDataTypeDef extends IQName, ISqlNode {
    kind?: undefined;
    /** Allows to differenciate types like 'double precision' from their double-quoted counterparts */
    doubleQuoted?: true;
    /** varchar(length), numeric(precision, scale), ... */
    config?: number[];
}
export interface ITableReference {
    foreignTable: IQName;
    foreignColumns: IName[];
    match?: 'full' | 'partial' | 'simple';
}
export type ISelectStatement = ISelectFromStatement | IValuesStatement;
export interface ISelectFromStatement extends ISqlNode {
    type: 'select';
    columns?: ISelectedColumn[] | INil;
    from?: IFrom[] | INil;
    where?: IExpr | INil;
    groupBy?: IExpr[] | INil;
    limit?: ILimitStatement | INil;
    orderBy?: IOrderByStatement[] | INil;
    distinct?: 'all' | 'distinct' | IExpr[] | INil;
    for?: IForStatement;
}
export interface IOrderByStatement extends ISqlNode {
    by: IExpr;
    order?: 'ASC' | 'DESC' | INil;
    nulls?: 'FIRST' | 'LAST' | INil;
}
export interface IForStatement extends ISqlNode {
    type: 'update' | 'no key update' | 'share' | 'key share';
}
export interface ILimitStatement extends ISqlNode {
    limit?: IExpr | INil;
    offset?: IExpr | INil;
}
export interface IUpdateStatement extends ISqlNode {
    type: 'update';
    table: IQNameAliased;
    sets: ISetStatement[];
    where?: IExpr | INil;
    from?: IFrom | INil;
    returning?: ISelectedColumn[] | INil;
}
export interface ISetStatement extends ISqlNode {
    column: IName;
    value: IExpr;
}
export interface ISelectedColumn extends ISqlNode {
    expr: IExpr;
    alias?: IName;
}
export type IFrom = FromTable | IFromStatement | IFromCall;
export interface IFromCall extends IExprCall, ISqlNode {
    alias?: ITableAliasName;
    join?: IJoinClause | INil;
    withOrdinality?: boolean;
}
export interface IValuesStatement extends ISqlNode {
    type: 'values';
    values: IExpr[][];
}
export interface IQNameAliased extends IQName, ISqlNode {
    alias?: string;
}
export interface IQNameMapped extends IQNameAliased {
    columnNames?: IName[] | INil;
}
export interface FromTable extends ISqlNode {
    type: 'table';
    name: IQNameMapped;
    join?: IJoinClause | INil;
}
export interface IFromStatement extends ISqlNode {
    type: 'statement';
    statement: ISelectStatement;
    alias: string;
    columnNames?: IName[] | INil;
    db?: null | INil;
    join?: IJoinClause | INil;
}
export interface IJoinClause extends ISqlNode {
    type: IJoinType;
    on?: IExpr | INil;
    using?: IName[] | INil;
}
export type IJoinType = 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL JOIN' | 'CROSS JOIN';
export type IExpr = IExprRef | IExprParameter | IExprList | IExprArrayFromSelect | IExprNull | IExprExtract | IExprInteger | IExprDefault | IExprMember | IExprValueKeyword | IExprArrayIndex | IExprNumeric | IExprString | IExprCase | IExprBinary | IExprUnary | IExprCast | IExprBool | IExprCall | ISelectStatement | IExprConstant | IExprTernary | IExprOverlay | IExprSubstring;
/**
 * Handle special syntax: overlay('12345678' placing 'ab' from 2 for 4)
 */
export interface IExprOverlay extends ISqlNode {
    type: 'overlay';
    value: IExpr;
    placing: IExpr;
    from: IExpr;
    for?: IExpr | INil;
}
/** Handle special syntax: substring('val' from 2 for 3) */
export interface IExprSubstring extends ISqlNode {
    type: 'substring';
    value: IExpr;
    from?: IExpr | INil;
    for?: IExpr | INil;
}
export type ILogicOperator = 'OR' | 'AND';
export type IEqualityOperator = 'IN' | 'NOT IN' | 'LIKE' | 'NOT LIKE' | 'ILIKE' | 'NOT ILIKE' | '=' | '!=';
export type IMathOpsBinary = '|' | '&' | '>>' | '^' | '#' | '<<' | '>>';
export type IComparisonOperator = '>' | '>=' | '<' | '<=' | '@>' | '<@' | '?' | '?|' | '?&' | '#>>' | '~' | '~*' | '!~' | '!~*';
export type IAdditiveOperator = '||' | '-' | '#-' | '&&' | '+';
export type IMultiplicativeOperator = '*' | '%' | '/';
export type IConstructOperator = 'AT TIME ZONE';
export type IBinaryOperator = ILogicOperator | IEqualityOperator | IComparisonOperator | IAdditiveOperator | IMultiplicativeOperator | IMathOpsBinary | IConstructOperator;
export interface IExprBinary extends ISqlNode {
    type: 'binary';
    left: IExpr;
    right: IExpr;
    op: IBinaryOperator;
    opSchema?: string;
}
export interface IExprConstant extends ISqlNode {
    type: 'constant';
    dataType: IDataTypeDef;
    value: any;
}
export type IExprLiteral = IExprConstant | IExprInteger | IExprNumeric | IExprString | IExprBool | IExprNull;
export interface IExprTernary extends ISqlNode {
    type: 'ternary';
    value: IExpr;
    lo: IExpr;
    hi: IExpr;
    op: 'BETWEEN' | 'NOT BETWEEN';
}
export interface IExprCast extends ISqlNode {
    type: 'cast';
    to: IDataTypeDef;
    operand: IExpr;
}
export type IUnaryOperator = '+' | '-' | 'NOT' | 'IS NULL' | 'IS NOT NULL' | 'IS TRUE' | 'IS FALSE' | 'IS NOT TRUE' | 'IS NOT FALSE';
export interface IExprUnary extends ISqlNode {
    type: 'unary';
    operand: IExpr;
    op: IUnaryOperator;
    opSchema?: string;
}
export interface IExprRef extends ISqlNode {
    type: 'ref';
    table?: IQName;
    name: string | '*';
}
export interface IExprParameter extends ISqlNode {
    type: 'parameter';
    name: string;
}
export interface IExprMember extends ISqlNode {
    type: 'member';
    operand: IExpr;
    op: '->' | '->>';
    member: string | number;
}
export interface IExprValueKeyword extends ISqlNode {
    type: 'keyword';
    keyword: IValueKeyword;
}
export type IValueKeyword = 'current_catalog' | 'current_date' | 'current_role' | 'current_schema' | 'current_timestamp' | 'current_time' | 'localtimestamp' | 'localtime' | 'session_user' | 'user' | 'current_user' | 'distinct';
/**
 * Function calls.
 *
 * For aggregation functions, see https://www.postgresql.org/docs/13/sql-expressions.html#SYNTAX-AGGREGATES
 */
export interface IExprCall extends ISqlNode {
    type: 'call';
    /** Function name */
    function: IQName;
    /** Arguments list */
    args: IExpr[];
    /** [AGGREGATION FUNCTIONS] Distinct clause specified ? */
    distinct?: 'all' | 'distinct';
    /** [AGGREGATION FUNCTIONS] Inner order by clause */
    orderBy?: IOrderByStatement[] | INil;
    /** [AGGREGATION FUNCTIONS] Filter clause */
    filter?: IExpr | INil;
    /** [AGGREGATION FUNCTIONS] OVER clause */
    over?: ICallOver | INil;
}
export interface ICallOver extends ISqlNode {
    orderBy?: IOrderByStatement[] | INil;
    partitionBy?: IExpr[] | INil;
}
export interface IExprExtract extends ISqlNode {
    type: 'extract';
    field: IName;
    from: IExpr;
}
export interface IExprList extends ISqlNode {
    type: 'list' | 'array';
    expressions: IExpr[];
}
export interface IExprArrayFromSelect extends ISqlNode {
    type: 'array select';
    select: ISelectStatement;
}
export interface IExprArrayIndex extends ISqlNode {
    type: 'arrayIndex';
    array: IExpr;
    index: IExpr;
}
export interface IExprNull extends ISqlNode {
    type: 'null';
}
export interface IExprInteger extends ISqlNode {
    type: 'integer';
    value: number;
}
export interface IExprDefault extends ISqlNode {
    type: 'default';
}
export interface IExprNumeric extends ISqlNode {
    type: 'numeric';
    value: number;
}
export interface IExprString extends ISqlNode {
    type: 'string';
    value: string;
}
export interface IExprBool extends ISqlNode {
    type: 'boolean';
    value: boolean;
}
export interface IExprCase extends ISqlNode {
    type: 'case';
    value?: IExpr | INil;
    whens: IExprWhen[];
    else?: IExpr | INil;
}
export interface IExprWhen extends ISqlNode {
    when: IExpr;
    value: IExpr;
}
export interface ICreateSequenceOptions extends ISqlNode {
    as?: IDataTypeDef;
    incrementBy?: number;
    minValue?: 'no minvalue' | number;
    maxValue?: 'no maxvalue' | number;
    startWith?: number;
    cache?: number;
    cycle?: 'cycle' | 'no cycle';
    ownedBy?: 'none' | IQColumn;
}
export type IGeometricLiteral = IPoint | ILine | ISegment | IBox | IPath | IPolygon | ICircle;
export interface IPoint {
    x: number;
    y: number;
}
/** Line  aX+bY+c */
export interface ILine {
    a: number;
    b: number;
    c: number;
}
export type ISegment = [IPoint, IPoint];
export type IBox = [IPoint, IPoint];
export interface IPath {
    closed: boolean;
    path: IPoint[];
}
export type IPolygon = IPoint[];
export interface ICircle {
    c: IPoint;
    r: number;
}
export interface IInterval {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
