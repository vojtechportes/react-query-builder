import { parseQuery } from './index';

describe('parseQuery JsonLogic', () => {
  it('parses logical groups and comparisons', () => {
    const result = parseQuery(
      JSON.stringify({
        and: [
          { '==': [{ var: 'status' }, 'active'] },
          { '>=': [{ var: 'age' }, 18] },
        ],
      }),
      'JsonLogic'
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

  it('parses contains, not-in, and between logic', () => {
    const result = parseQuery(
      JSON.stringify({
        and: [
          { in: ['pro', { var: 'tags' }] },
          { '!': { in: [{ var: 'status' }, ['archived', 'deleted']] } },
          { '<=': [10, { var: 'score' }, 20] },
        ],
      }),
      'JsonLogic'
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
            operator: 'NOT_IN',
            value: ['archived', 'deleted'],
          },
          { field: 'score', operator: 'BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });
});

