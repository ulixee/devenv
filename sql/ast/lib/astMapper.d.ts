import IAstPartialMapper from '../interfaces/IAstPartialMapper';
export type IAstFullMapper = {
    [key in keyof IAstPartialMapper]-?: IAstPartialMapper[key];
};
export type IAstMapper = IAstFullMapper & {
    /** Forces the next call to use the default implementation, not yours */
    super(): IAstMapper;
};
/**
 * Builds an AST modifier based on the default implementation, merged with the one you provide.
 *
 * Example of a modifier that renames all reference to columns 'foo' to 'bar'
 * ```ts
 *  const mapper = astMapper(b => ({
 *       ref: a => assignChanged(a, {
 *           name: a.name === 'foo'
 *               ? 'bar'
 *               : a.name
 *       })
 *   }));
 *
 * const modified = mapper.statement(myStatementToModify);
 * ```
 */
export declare function astMapper(modifierBuilder: MapperBuilder): IAstMapper;
export type MapperBuilder = (defaultImplem: IAstMapper) => IAstPartialMapper;
