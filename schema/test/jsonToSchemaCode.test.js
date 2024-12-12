"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const jsonToSchemaCode_1 = require("../lib/jsonToSchemaCode");
test('should be able to generate a schema from json', () => {
    const schema = (0, index_1.object)({
        field1: (0, index_1.string)({ description: 'This is a test', format: 'email' }),
        field2: (0, index_1.string)({ length: 4 }),
        field3: (0, index_1.string)({ optional: true }),
        'field-4': (0, index_1.number)(),
    });
    const json = JSON.parse(JSON.stringify(schema));
    const schema2 = (0, jsonToSchemaCode_1.default)(json, new Set());
    expect(schema2).toBe(`object({
  field1: string({
    description: "This is a test",
    format: "email",
  }),
  field2: string({ length: 4 }),
  field3: string({ optional: true }),
  "field-4": number(),
})`);
});
test('should be able to generate a nested object structure from json', () => {
    const schema = {
        test: (0, index_1.object)({
            optional: false,
            fields: {
                field1: (0, index_1.string)({ description: 'This is a test', format: 'email' }),
                field3: (0, index_1.array)((0, index_1.object)({ 'tester-2': (0, index_1.number)({ optional: true }) })),
            },
        }),
        test2: (0, index_1.bigint)(),
    };
    const json = JSON.parse(JSON.stringify(schema));
    const schema2 = (0, jsonToSchemaCode_1.default)(json, new Set());
    expect(schema2).toBe(`{
  test: object({
    field1: string({
      description: "This is a test",
      format: "email",
    }),
    field3: array(object({
      "tester-2": number({ optional: true }),
    })),
  }),
  test2: bigint(),
}`);
});
//# sourceMappingURL=jsonToSchemaCode.test.js.map