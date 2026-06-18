import { removeNormalizedQueryNegation } from './remove-normalized-query-negation.util';
import { removeQueryNegation } from './remove-query-negation.util';

describe('removeQueryNegation', () => {
  it('returns the original denormalized query reference when nothing changes', () => {
    const query = [
      {
        type: 'GROUP' as const,
        value: 'AND' as const,
        isNegated: false,
        children: [{ field: 'STATUS', operator: 'EQUAL' as const, value: 'open' }],
      },
    ];

    expect(removeQueryNegation(query)).toBe(query);
  });

  it('only clones denormalized branches that need negation removed', () => {
    const query = [
      {
        type: 'GROUP' as const,
        value: 'AND' as const,
        isNegated: true,
        children: [
          { field: 'STATUS', operator: 'EQUAL' as const, value: 'open' },
          {
            type: 'GROUP' as const,
            value: 'OR' as const,
            isNegated: false,
            children: [{ field: 'PRIORITY', operator: 'EQUAL' as const, value: 'high' }],
          },
        ],
      },
    ];

    const nextQuery = removeQueryNegation(query);

    expect(nextQuery).not.toBe(query);
    expect(nextQuery[0]).not.toBe(query[0]);
    expect((nextQuery[0] as (typeof query)[number]).isNegated).toBe(false);
    expect((nextQuery[0] as (typeof query)[number]).children[0]).toBe(
      query[0].children[0]
    );
    expect((nextQuery[0] as (typeof query)[number]).children[1]).toBe(
      query[0].children[1]
    );
  });
});

describe('removeNormalizedQueryNegation', () => {
  it('returns the original normalized query reference when nothing changes', () => {
    const query = [
      {
        type: 'GROUP' as const,
        id: 'group-1',
        value: 'AND' as const,
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        parent: 'group-1',
        field: 'STATUS',
        operator: 'EQUAL' as const,
        value: 'open',
      },
    ];

    expect(removeNormalizedQueryNegation(query)).toBe(query);
  });
});
