import { collectParsedSqlRules } from './collect-parsed-sql-rules';

describe('collect-parsed-sql-rules', () => {
  it('collects rules recursively while preserving source metadata', () => {
    const rule = {
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
      source: { start: 0, end: 14 },
    } as const;
    const nodes = [
      {
        kind: 'group',
        combinator: 'AND',
        isNegated: false,
        children: [rule],
      },
    ];

    expect(collectParsedSqlRules(nodes as never)).toEqual([rule]);
  });
});
