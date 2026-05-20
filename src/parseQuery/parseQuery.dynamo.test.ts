import { parseQuery } from './index';

describe('parseQuery Dynamo', () => {
  it('parses comparison, in, and boolean groups', () => {
    const result = parseQuery(
      "(status IN ('active', 'paused') AND age >= 18)",
      'Dynamo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['active', 'paused'] },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses functions, null checks, and not-between logic', () => {
    const result = parseQuery(
      "(contains(tags, 'pro') AND attribute_exists(status) AND (score < 10 OR score > 20))",
      'Dynamo'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          { field: 'status', operator: 'IS_NOT_NULL' },
          { field: 'score', operator: 'NOT_BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });
});
