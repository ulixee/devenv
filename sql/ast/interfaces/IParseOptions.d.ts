export default interface IParseOptions {
    /**
     *  [Advanced usage only] This allows to parse sub-expressions, not necessarily full valid statements.
     *
     *  For instance, `parse('2+2', {entry: 'expr'})`  will return the AST of the given expression (which is not a valid statement)
     */
    entry?: string;
    /** If true, then a detailed location will be available on each node */
    locationTracking?: boolean;
}
