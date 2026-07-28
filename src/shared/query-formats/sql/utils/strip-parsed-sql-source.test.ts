import { stripParsedSqlSource } from './strip-parsed-sql-source';

describe('strip-parsed-sql-source', () => {
  it('removes source metadata recursively', () => {
    const nodes = [
      {
        kind: 'group',
        combinator: 'AND',
        isNegated: false,
        children: [
          {
            field: 'name',
            operator: 'EQUAL',
            value: 'Alice',
            source: { start: 0, end: 14 },
          },
        ],
      },
    ];

    expect(stripParsedSqlSource(nodes as never)).toEqual([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);
  });
});
