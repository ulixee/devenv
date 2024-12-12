"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
test('should be able to create an int schema', () => {
    const schema = (0, index_1.number)({ integer: true });
    expect(schema.validate(1).success).toBe(true);
    expect(schema.validate('test').success).toBe(false);
    expect(schema.validate(1.2).success).toBe(false);
});
test('should be able to create an decimal schema', () => {
    const schema = (0, index_1.number)({ decimals: 1 });
    expect(schema.validate(1.1).success).toBe(true);
    expect(schema.validate('test').success).toBe(false);
    expect(schema.validate(1).success).toBe(false);
});
test('should be able to create an bigint schema', () => {
    const schema = (0, index_1.bigint)();
    expect(schema.validate(1n).success).toBe(true);
    expect(schema.validate('test').success).toBe(false);
    expect(schema.validate(1).success).toBe(false);
});
test('should be able to validate a number has a max range', () => {
    const schema = (0, index_1.number)({ max: 10 });
    expect(schema.validate(0).success).toBe(true);
    expect(schema.validate(-190).success).toBe(true);
    expect(schema.validate(11).success).toBe(false);
});
test('should be able to validate a number has a min range', () => {
    const schema = (0, index_1.number)({ min: 0 });
    expect(schema.validate(1).success).toBe(true);
    expect(schema.validate(-190).success).toBe(false);
    expect(schema.validate(1).success).toBe(true);
});
//# sourceMappingURL=Number.test.js.map