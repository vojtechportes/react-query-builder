import type { DenormalizedQuery } from '../../utils/query-tree';
import { formatQuery } from '../../formatQuery';
import { parseQuery } from '../../parseQuery';

describe('Django roundtrip', () => {
  it('round-trips a supported query subset', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'name', operator: 'STARTS_WITH', value: 'Al' },
          { field: 'age', operator: 'BETWEEN', value: [18, 30] },
        ],
      },
    ];

    const expression = formatQuery(query, 'Django');
    const parsed = parseQuery(expression, 'Django');

    expect(parsed.data).toEqual(query);
  });
});
