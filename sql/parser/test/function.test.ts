import { ISelectFromStatement } from '@ulixee/sql-ast';
import { number, string } from '@ulixee/schema';
import SqlParser from '../index';

test('support named args', () => {
  const sqlParser = new SqlParser(`SELECT * FROM func(count => 0, success => 'yes')`);
  const ast = sqlParser.ast as ISelectFromStatement;
  expect(ast.from[0].type).toBe('call');
  expect((ast.from[0] as any).args).toMatchObject([
    {
      "type": "integer",
      "value": 0,
      "key": "count"
    },
    {
      "type": "string",
      "value": "yes",
      "key": "success"
    }
  ]);
});

test('support unnamed args', () => {
  const sqlParser = new SqlParser(`SELECT * FROM func(0, 'yes')`);
  const ast = sqlParser.ast as ISelectFromStatement;
  expect(ast.from[0].type).toBe('call');
  expect((ast.from[0] as any).args).toMatchObject([
    {
      "type": "integer",
      "value": 0
    },
    {
      "type": "string",
      "value": "yes"
    }
  ]);
});

test('extractFunctionInput', () => {
  const sqlParser = new SqlParser(`SELECT * FROM func(count => 0, success => 'yes')`);
  const inputSchemas = {
    func: {
      count: number(),
      success: string(),
    }
  }
  const inputs = sqlParser.extractFunctionInputs(inputSchemas, []);

  expect(inputs.func).toMatchObject({
    count: 0,
    success: 'yes',
  });
});

test('extractFunctionInput with boundValues', () => {
  const sqlParser = new SqlParser(`SELECT * FROM func(count => $1, success => $2)`);
  const inputSchemas = {
    func: {
      count: number(),
      success: string(),
    }
  }
  const inputs = sqlParser.extractFunctionInputs(inputSchemas, [0, 'yes']);
  
  expect(inputs.func).toMatchObject({
    count: 0,
    success: 'yes',
  });
});

