import { parseQuery } from './index';

describe('parseQuery AQL', () => {
  it('parses a FILTER clause from a FOR query and strips the loop variable', () => {
    const result = parseQuery(
      'FOR doc IN customers FILTER doc.first_name LIKE "Stev%" AND doc.age >= 18 RETURN doc',
      'AQL'
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

  it('parses null checks, arrays, and negated groups', () => {
    const result = parseQuery(
      'FILTER status IN ["open", "pending"] AND NOT archived_at != null',
      'AQL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['open', 'pending'] },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: true,
            children: [{ field: 'archived_at', operator: 'IS_NOT_NULL' }],
          },
        ],
      },
    ]);
  });
});

