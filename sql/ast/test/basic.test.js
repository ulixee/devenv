"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../testing/helpers");
describe('Select statements', () => {
    (0, helpers_1.checkSelect)(['select * from default()'], {
        type: 'select',
        columns: (0, helpers_1.columns)({ type: 'ref', name: '*' }),
        from: [{ type: 'call', function: { name: 'default' }, args: [] }],
    });
});
//# sourceMappingURL=basic.test.js.map