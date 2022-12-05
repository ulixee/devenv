// stolen from https://github.com/segmentio/pg-escape/blob/master/index.js

export default function pgEscape(val: string): string {
  if (val == null) return 'NULL';
  if (Array.isArray(val)) {
    const vals: any[] = val.map(pgEscape);
    return `(${vals.join(", ")})`;
  }
  const backslash = ~val.indexOf('\\');
  const prefix = backslash ? 'E' : '';
  val = val.replace(/'/g, "''");
  val = val.replace(/\\/g, '\\\\');
  return `${prefix}'${val}'`;
};
