import { collectParsedRuleEntries } from './collect-parsed-rule-entries.util';

describe('collectParsedRuleEntries', () => {
  it('collects rules with parent scope ids', () => {
    const entries = collectParsedRuleEntries([
      {
        kind: 'group' as const,
        combinator: 'AND' as const,
        isNegated: false,
        children: [
          {
            field: 'STATUS',
            operator: 'EQUAL' as const,
            value: 'open',
            source: {
              field: { start: 0, end: 6 },
            },
          },
        ],
      },
    ]);

    expect(entries).toEqual([
      {
        parentScopeId: '__root__.0',
        rule: {
          field: 'STATUS',
          operator: 'EQUAL',
          value: 'open',
          source: {
            field: { start: 0, end: 6 },
          },
        },
      },
    ]);
  });
});
