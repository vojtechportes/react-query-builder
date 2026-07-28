import { parseJsonLogicExpression } from './parse-json-logic-expression';

describe('parse-json-logic-expression', () => {
  it('parses a representative equality expression', () => {
    expect(
      parseJsonLogicExpression({ '==': [{ var: 'name' }, 'Alice'] })
    ).toEqual([{ field: 'name', operator: 'EQUAL', value: 'Alice' }]);
  });

  it('rejects unsupported input', () => {
    expect(() => parseJsonLogicExpression(null as never)).toThrow();
  });
});
