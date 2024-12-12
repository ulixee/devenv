"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../testing/helpers");
describe('Delete', () => {
    (0, helpers_1.checkDelete)([`delete from test where a = b`], {
        type: 'delete',
        from: { name: 'test' },
        where: {
            type: 'binary',
            op: '=',
            left: { type: 'ref', name: 'a' },
            right: { type: 'ref', name: 'b' },
        }
    });
    (0, helpers_1.checkDelete)([`delete from test`], {
        type: 'delete',
        from: { name: 'test' },
    });
    (0, helpers_1.checkDelete)([`delete from test returning *`], {
        type: 'delete',
        from: { name: 'test' },
        returning: [{
                expr: { type: 'ref', name: '*' }
            }]
    });
});
//# sourceMappingURL=delete.test.js.map