import { parseSpelRule } from './parse-spel-rule';

describe('parse-spel-rule', () => {
  it('parses scalar and field comparison rules', () => {
    expect(parseSpelRule("name == 'Alice'")).toEqual({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });
    expect(parseSpelRule('price >= cost')).toEqual({
      field: 'price',
      operator: 'LARGER_EQUAL',
      valueSource: 'field',
      valueField: 'cost',
    });
  });

  it('returns null for unsupported syntax', () => {
    expect(parseSpelRule('name ?? value')).toBeNull();
  });
});
