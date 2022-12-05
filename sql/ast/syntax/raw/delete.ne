@lexer lexerAny
@include "base.ne"
@include "expr.ne"
@include "select.ne"

array_of[EXP] -> $EXP (%comma $EXP {% last %}):* {% ([head, tail]) => {
    return [unwrap(head), ...(tail.map(unwrap) || [])];
} %}


# https://www.postgresql.org/docs/12/sql-delete.html


delete_statement -> delete_delete

delete_delete -> (kw_delete %kw_from)
                        table_ref_aliased
                    select_where:?
                    (%kw_returning select_expr_list_aliased {% last %}):?
                    {% x => {
                        const where = x[2];
                        const returning = x[3];
                        return track(x, {
                            type: 'delete',
                            from: unwrap(x[1]),
                            ...where ? { where } : {},
                            ...returning ? { returning } : {},
                        });
                    } %}
