"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const schemaToInterface_1 = require("../lib/schemaToInterface");
test('should be able to generate a type', () => {
    const schema = (0, index_1.object)({
        field1: (0, index_1.string)({ description: 'This is a test', format: 'email' }),
        field2: (0, index_1.string)({ length: 4 }),
        field3: (0, index_1.string)({ optional: true }),
        'field-4': (0, index_1.number)(),
    });
    const ts = (0, schemaToInterface_1.default)(schema);
    expect((0, schemaToInterface_1.printNode)(ts)).toBe(`{
  /**
   * This is a test
   * @format email
   */
  field1: string;
  /**
   * @length 4
   */
  field2: string;
  field3?: string;
  "field-4": number;
}`);
});
//# sourceMappingURL=schemaToInterface.test.js.map