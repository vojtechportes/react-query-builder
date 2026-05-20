import { parseQuery } from './index';

describe('parseQuery RSQL', () => {
  it('parses in/out operators and logical groups', () => {
    const result = parseQuery(
      '(status=in=(active,paused);age=ge=18)',
      'RSQL'
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

  it('parses wildcard patterns and collapses between logic', () => {
    const result = parseQuery(
      "(name==*pro*;(slug==vip*,code==*2025);(score=ge=10;score=le=20))",
      'RSQL'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'CONTAINS', value: 'pro' },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              { field: 'slug', operator: 'STARTS_WITH', value: 'vip' },
              { field: 'code', operator: 'ENDS_WITH', value: '2025' },
            ],
          },
          { field: 'score', operator: 'BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });
});
