import { findFirstGroupWithNegationToken } from './find-first-group-with-negation-token.util';

describe('findFirstGroupWithNegationToken', () => {
  it('finds the first group that carries a negation token', () => {
    const group = findFirstGroupWithNegationToken([
      {
        kind: 'group' as const,
        combinator: 'AND' as const,
        isNegated: false,
        children: [
          {
            kind: 'group' as const,
            combinator: 'AND' as const,
            isNegated: true,
            negationSources: [{ start: 5, end: 8 }],
            children: [],
          },
        ],
      },
    ]);

    expect(group).toMatchObject({
      isNegated: true,
      negationSources: [{ start: 5, end: 8 }],
    });
  });

  it('returns null when no group carries a negation token', () => {
    expect(
      findFirstGroupWithNegationToken([
        {
          kind: 'group' as const,
          combinator: 'AND' as const,
          isNegated: false,
          children: [],
        },
      ])
    ).toBeNull();
  });
});
