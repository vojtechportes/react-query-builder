import { parseQuery } from './index';

describe('parseQuery JSONata', () => {
  it('parses comparisons and contains expressions', () => {
    const result = parseQuery(
      '$contains(first_name, /^Stev/) and age >= 18',
      'JSONata'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'first_name', operator: 'STARTS_WITH', value: 'Stev' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses list membership and negated contains', () => {
    const result = parseQuery(
      'status in ["open", "pending"] and $not($contains(name, "test"))',
      'JSONata'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['open', 'pending'] },
          { field: 'name', operator: 'NOT_CONTAINS', value: 'test' },
        ],
      },
    ]);
  });
});

