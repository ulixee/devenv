"use strict";
// stolen from https://github.com/segmentio/pg-escape/blob/master/index.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgEscape;
function pgEscape(val) {
    if (val == null)
        return 'NULL';
    if (Array.isArray(val)) {
        const vals = val.map(pgEscape);
        return `(${vals.join(", ")})`;
    }
    const backslash = ~val.indexOf('\\');
    const prefix = backslash ? 'E' : '';
    val = val.replace(/'/g, "''");
    val = val.replace(/\\/g, '\\\\');
    return `${prefix}'${val}'`;
}
;
//# sourceMappingURL=pgEscape.js.map