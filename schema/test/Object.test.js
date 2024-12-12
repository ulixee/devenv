"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
test('should be able to create an object schema', () => {
    const schema = (0, index_1.object)({
        one: (0, index_1.boolean)(),
        two: (0, index_1.string)(),
        three: (0, index_1.number)({ optional: true }),
    });
    const testOptional = {
        one: true,
        two: 'two',
    };
    expect(testOptional).toBeTruthy();
    expect(schema.validate({ one: true, two: '' }).success).toBe(true);
    expect(schema.validate({ one: true, two: '', three: 1 }).success).toBe(true);
    expect(schema.validate({ one: true, two: '', three: '' }).success).toBe(false);
    expect(schema.validate({ one: true, two: '', three: '' }).errors).toHaveLength(1);
    expect(schema.validate({ one: true, two: '', three: '' }).errors[0]).toEqual(expect.objectContaining({
        code: 'invalidType',
        path: '.three',
    }));
});
test('should be able to create an object schema with nested objects', () => {
    const nested = (0, index_1.object)({
        one: (0, index_1.string)(),
        two: (0, index_1.string)({ format: 'email' }),
    });
    const record = {
        one: (0, index_1.string)({ optional: true }),
        two: (0, index_1.string)({ format: 'email' }),
        nested: (0, index_1.object)({
            three: (0, index_1.buffer)({ optional: true }),
            four: (0, index_1.number)({ optional: false }),
        }),
        nestedWithFields: (0, index_1.object)({
            optional: true,
            fields: {
                five: (0, index_1.number)({ optional: true }),
                six: (0, index_1.date)(),
                seven: (0, index_1.bigint)({ optional: false }),
            },
        }),
    };
    // test out some nested optionals (just in typescript)
    const nestedOptionalSchema = {
        two: 'two',
        nested: {
            four: 1,
        },
    };
    expect(nestedOptionalSchema).toBeTruthy();
    const nestedBadTypeField = {
        two: 'two',
        nested: {
            four: 1,
        },
        // @ts-expect-error
        nestedWithFields: { bad: true, seven: 2n, six: new Date() },
    };
    expect(nestedBadTypeField).toBeTruthy();
    const nestedOptionalField = {
        two: 'two',
        nested: {
            four: 1,
        },
        nestedWithFields: { seven: 2n, six: new Date() },
    };
    expect(nestedOptionalField).toBeTruthy();
    const schema = (0, index_1.object)({
        fields: {
            one: (0, index_1.boolean)(),
            twoArray: (0, index_1.array)(nested),
        },
    });
    expect(schema.validate({ one: true, two: '' }).success).toBe(false);
    expect(schema.validate({ one: true, twoArray: '' }).errors[0]).toEqual(expect.objectContaining({
        code: 'invalidType',
        path: '.twoArray',
    }));
    const jsonExample = {
        one: false,
        twoArray: [
            {
                one: 'one',
                two: 'email@gmail.com',
            },
            {
                one: 'two',
                two: 'notAnEmail',
            },
        ],
    };
    expect(schema.validate(jsonExample).errors[0]).toEqual(expect.objectContaining({
        code: 'constraintFailed',
        path: '.twoArray.1.two',
    }));
});
//# sourceMappingURL=Object.test.js.map