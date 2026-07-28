import { escapeSqlString, isGroupNode, isRuleNode } from './shared';

describe('shared', () => {
  it('distinguishes query nodes and escapes SQL strings', () => {
    const group = { type: 'GROUP', children: [] } as const;
    const rule = { field: 'name', operator: 'EQUAL', value: 'Alice' } as const;

    expect(isGroupNode(group as never)).toBe(true);
    expect(isRuleNode(rule as never)).toBe(true);
    expect(escapeSqlString("O'Reilly")).toBe("O''Reilly");
  });
});
