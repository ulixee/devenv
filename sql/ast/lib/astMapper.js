"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astMapper = astMapper;
const AstDefaultMapper_1 = require("./AstDefaultMapper");
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
function astMapper(modifierBuilder) {
    const instance = new AstDefaultMapper_1.default();
    instance.wrapped = modifierBuilder(instance);
    return instance;
}
//# sourceMappingURL=astMapper.js.map