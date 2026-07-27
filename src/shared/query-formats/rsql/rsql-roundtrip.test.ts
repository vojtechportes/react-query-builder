import type { DenormalizedQuery } from '../../query/model/types/query-tree';
import { formatRsql } from './format-rsql';
import { parseRsql } from './parse-rsql';

describe('RSQL roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          { field: 'status', operator: 'IN', value: ['active', 'paused'] },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    const expression = formatRsql(query);
    const parsed = parseRsql(expression);

    expect(parsed.data).toEqual(query);
  });
});
