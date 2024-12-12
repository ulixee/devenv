import { IAstMapper } from "./astMapper";
import * as a from '../interfaces/ISqlNode';
import INil from "../interfaces/INil";
import IAstPartialMapper from "../interfaces/IAstPartialMapper";
export default class AstDefaultMapper implements IAstMapper {
    wrapped?: IAstPartialMapper;
    skipNext?: boolean;
    super(): SkipModifier;
    statement(val: a.IStatement): a.IStatement | INil;
    comment(val: a.ICommentStatement): a.IStatement | INil;
    update(val: a.IUpdateStatement): a.IStatement | INil;
    insert(val: a.IInsertStatement): a.IStatement | INil;
    delete(val: a.IDeleteStatement): a.IStatement | INil;
    set(st: a.ISetStatement): a.ISetStatement | INil;
    /** Called when a data type definition is encountered */
    dataType(dataType: a.IDataTypeDef): a.IDataTypeDef;
    /** Called when an alias of a table is created */
    tableRef(st: a.IQNameAliased): a.IQNameAliased | INil;
    select(val: a.ISelectStatement): a.ISelectStatement | INil;
    selection(val: a.ISelectFromStatement): a.ISelectStatement | INil;
    orderBy(orderBy: a.IOrderByStatement[] | null | undefined): a.IOrderByStatement[];
    from(from: a.IFrom): a.IFrom | INil;
    fromCall(from: a.IFromCall): a.IFrom | INil;
    fromStatement(from: a.IFromStatement): a.IFrom | INil;
    values(from: a.IValuesStatement): a.ISelectStatement | INil;
    join(join: a.IJoinClause): a.IJoinClause | INil;
    fromTable(from: a.FromTable): a.IFrom | INil;
    selectionColumn(val: a.ISelectedColumn): a.ISelectedColumn | INil;
    expr(val: a.IExpr | INil): a.IExpr | INil;
    arraySelect(val: a.IExprArrayFromSelect): a.IExprArrayFromSelect;
    extract(st: a.IExprExtract): a.IExpr | INil;
    valueKeyword(val: a.IExprValueKeyword): a.IExpr | INil;
    ternary(val: a.IExprTernary): a.IExpr | INil;
    parameter(st: a.IExprParameter): a.IExpr | INil;
    arrayIndex(val: a.IExprArrayIndex): a.IExpr | INil;
    member(val: a.IExprMember): a.IExpr | INil;
    case(value: a.IExprCase): a.IExpr | INil;
    cast(val: a.IExprCast): a.IExpr | INil;
    call(val: a.IExprCall): a.IExpr | INil;
    callSubstring(val: a.IExprSubstring): a.IExpr | INil;
    callOverlay(val: a.IExprOverlay): a.IExpr | INil;
    array(val: a.IExprList): a.IExpr | INil;
    constant(value: a.IExprLiteral): a.IExpr | INil;
    default(value: a.IExprDefault): a.IExpr | INil;
    /** Called when a reference is used */
    ref(val: a.IExprRef): a.IExpr | INil;
    unary(val: a.IExprUnary): a.IExpr | INil;
    binary(val: a.IExprBinary): a.IExpr | INil;
}
declare class SkipModifier extends AstDefaultMapper {
    readonly parent: AstDefaultMapper;
    constructor(parent: AstDefaultMapper);
}
export {};
