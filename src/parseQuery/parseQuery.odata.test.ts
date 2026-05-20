import { parseQuery } from './index';

describe('parseQuery OData', () => {
  it('parses filter wrapper, logical groups, and comparisons', () => {
    const result = parseQuery(
      "$filter=(status eq 'active' and age ge 18)",
      'OData'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'EQUAL', value: 'active' },
          { field: 'age', operator: 'LARGER_EQUAL', value: 18 },
        ],
      },
    ]);
  });

  it('parses contains, not-contains, and between logic', () => {
    const result = parseQuery(
      "(contains(tags,'pro') and not contains(status,'archived') and (score ge 10 and score le 20))",
      'OData'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'CONTAINS', value: 'pro' },
          {
            field: 'status',
            operator: 'NOT_CONTAINS',
            value: 'archived',
          },
          { field: 'score', operator: 'BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });
});
