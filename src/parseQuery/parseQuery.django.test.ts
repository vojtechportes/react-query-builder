import { parseQuery } from './index';

describe('parseQuery Django', () => {
  it('parses Q lookups and logical groups', () => {
    const result = parseQuery(
      "(Q(status__in=['active', 'paused']) & Q(age__gte=18))",
      'Django'
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

  it('parses not, grouped range logic, and null checks', () => {
    const result = parseQuery(
      "(~Q(tags__contains='pro') & Q(status__isnull=False) & (Q(score__lt=10) | Q(score__gt=20)))",
      'Django'
    );

    expect(result.data).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'tags', operator: 'NOT_CONTAINS', value: 'pro' },
          { field: 'status', operator: 'IS_NOT_NULL' },
          { field: 'score', operator: 'NOT_BETWEEN', value: [10, 20] },
        ],
      },
    ]);
  });
});
