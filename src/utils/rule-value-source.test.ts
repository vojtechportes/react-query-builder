import {
  getRuleValueSource,
  isFieldComparisonRule,
  isLiteralComparisonRule,
} from './rule-value-source';

describe('#utils/rule-value-source', () => {
  it('Defaults missing valueSource to literal mode', () => {
    expect(getRuleValueSource({})).toEqual('value');
  });

  it('Returns explicit value sources unchanged', () => {
    expect(getRuleValueSource({ valueSource: 'value' })).toEqual('value');
    expect(getRuleValueSource({ valueSource: 'field' })).toEqual('field');
  });

  it('Recognizes field comparison rules', () => {
    expect(
      isFieldComparisonRule({
        field: 'PRICE',
        valueSource: 'field',
        valueField: 'COST',
      })
    ).toBe(true);
  });

  it('Does not treat literal rules as field comparisons', () => {
    expect(
      isFieldComparisonRule({
        field: 'PRICE',
        valueSource: 'value',
        value: 100,
      } as any)
    ).toBe(false);
  });

  it('Recognizes literal comparison rules', () => {
    expect(
      isLiteralComparisonRule({
        field: 'PRICE',
        value: 100,
      })
    ).toBe(true);
  });

  it('Does not treat field comparisons as literal rules', () => {
    expect(
      isLiteralComparisonRule({
        field: 'PRICE',
        valueSource: 'field',
        valueField: 'COST',
      } as any)
    ).toBe(false);
  });
});
