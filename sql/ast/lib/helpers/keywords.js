"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlKeywords = void 0;
// https://www.postgresql.org/docs/current/sql-keywords-appendix.html
// $('table.table').children('tbody').children().toArray().filter(x => { const txt = $($(x).children()[1]).text(); return txt.includes('reserved') && !txt.includes('non-reserved')}).map(x => $($(x).children()[0]).text())
exports.sqlKeywords = [
    "ALL", "ANALYSE", "ANALYZE", "AND", "ANY", "ARRAY", "AS", "ASC", "ASYMMETRIC", "AUTHORIZATION", "BINARY", "BOTH", "CASE", "CAST", "CHECK", "COLLATE", "COLLATION", "CONCURRENTLY", "CROSS", "CURRENT_CATALOG", "CURRENT_DATE", "CURRENT_ROLE", "CURRENT_SCHEMA", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "DEFAULT", "DEFERRABLE", "DESC", "DISTINCT", "ELSE", "END", "FALSE", "FETCH", "FOR", "FOREIGN", "FREEZE", "FROM", "FULL", "GRANT", "GROUP", "HAVING", "ILIKE", "IN", "INITIALLY", "INNER", "INTO", "IS", "ISNULL", "JOIN", "LATERAL", "LEADING", "LEFT", "LIKE", "LIMIT", "LOCALTIME", "LOCALTIMESTAMP", "NATURAL", "NOT", "NOTNULL", "NULL", "OFFSET", "ON", "ONLY", "OR", "ORDER", "OUTER", "OVERLAPS", "PLACING", "PRIMARY", "REFERENCES", "RETURNING", "RIGHT", "SELECT", "SESSION_USER", "SIMILAR", "SOME", "SYMMETRIC", "TABLE", "TABLESAMPLE", "THEN", "TO", "TRAILING", "TRUE", "UNIQUE", "USER", "USING", "VARIADIC", "VERBOSE", "WHEN", "WITH", "WHERE"
    // added manually
    ,
    "PRECISION"
];
//# sourceMappingURL=keywords.js.map