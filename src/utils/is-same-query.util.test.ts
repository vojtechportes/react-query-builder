import { isSameQuery } from './is-same-query.util';
import { DenormalizedQuery } from './query-tree';

describe('#utils/isSameQuery', () => {
  it('Returns true for identical rule trees', () => {
    const leftQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(true);
  });

  it('Returns false when a nested rule changes', () => {
    const leftQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    const rightQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Bob' }],
      },
    ];

    expect(isSameQuery(leftQuery, rightQuery)).toBe(false);
  });
});
