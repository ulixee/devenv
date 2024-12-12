"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astVisitor = astVisitor;
const AstDefaultMapper_1 = require("./AstDefaultMapper");
const astMapper_1 = require("./astMapper");
class Visitor {
    super() {
        return new SkipVisitor(this);
    }
}
// =============== auto implement the mapper
const mapperProto = AstDefaultMapper_1.default.prototype;
for (const k of Object.getOwnPropertyNames(mapperProto)) {
    const orig = mapperProto[k];
    if (k === 'constructor' || k === 'super' || typeof orig !== 'function') {
        continue;
    }
    Object.defineProperty(Visitor.prototype, k, {
        configurable: false,
        get() {
            return function get(...args) {
                const impl = this.visitor[k];
                if (!impl) {
                    // just ignore & forward call to mapper
                    return orig.apply(this, args);
                }
                // return first argument
                // ...which means "I dont wana change anything"
                //    in the ast-modifier language.
                impl.apply(this.visitor, args);
                return args[0];
            };
        }
    });
}
// ====== auto implement the skip mechanism
class SkipVisitor {
    constructor(parent) {
        this.parent = parent;
    }
}
for (const k of Object.getOwnPropertyNames(mapperProto)) {
    const orig = mapperProto[k];
    if (k === 'constructor' || k === 'super' || typeof orig !== 'function') {
        continue;
    }
    Object.defineProperty(SkipVisitor.prototype, k, {
        configurable: false,
        get() {
            return function get(...args) {
                return orig.apply(this.parent, args);
            };
        }
    });
}
/**
 * Builds an AST visitor based on the default implementation, merged with the one you provide.
 *
 * Example of visitor which counts references to a column 'foo':
 *
 * ```ts
 * let cnt = 0;
 * const visitor = astVisitor(v => ({
 *      ref: r => {
 *          if (r.name === 'foo') {
 *              cnt++;
 *          }
 *          v.super().ref(r);
 *      }
 *  }));
 *
 * visitor.statement(myStatementToCount);
 * console.log(`${cnt} references to foo !`);
 * ```
 */
function astVisitor(visitorBuilder) {
    return (0, astMapper_1.astMapper)(m => {
        const ret = new Visitor();
        ret.mapper = m;
        ret.visitor = visitorBuilder(ret);
        return ret;
    });
}
//# sourceMappingURL=astVisitor.js.map