"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const astVisitor_1 = require("../lib/astVisitor");
describe('Ast visitor', () => {
    // just a quickcheck. (those were throwing)
    it('visits ref when implemented', () => {
        let visited = null;
        const mapper = (0, astVisitor_1.astVisitor)(() => ({
            ref: r => (visited = r.name),
        }));
        mapper.expr({
            type: 'unary',
            op: 'NOT',
            operand: {
                type: 'ref',
                name: 'myRef',
            },
        });
        expect(visited).toEqual('myRef');
    });
    it('does not visit ref when not implemented', () => {
        expect(() => (0, astVisitor_1.astVisitor)(() => ({})).expr({
            type: 'unary',
            op: 'NOT',
            operand: {
                type: 'ref',
                name: 'myRef',
            },
        })).not.toThrow();
    });
    it('allow super call', () => {
        let visited = null;
        (0, astVisitor_1.astVisitor)(v => ({
            ref: r => {
                visited = r.name;
                return v.super().ref(r);
            },
        })).expr({
            type: 'unary',
            op: 'NOT',
            operand: {
                type: 'ref',
                name: 'myRef',
            },
        });
        expect(visited).toEqual('myRef');
    });
});
//# sourceMappingURL=astVisitor.test.js.map