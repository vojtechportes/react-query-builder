import { emitQuery, ingestQuery } from './query-tree-adapter';
import { DenormalizedQuery } from './query-tree';

describe('#utils/queryTreeAdapter', () => {
  it('Ingests empty input into a usable root group', () => {
    const normalizedQuery = ingestQuery([]);

    expect(normalizedQuery).toHaveLength(1);
    expect(normalizedQuery[0]).toMatchObject({
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      children: [],
    });
  });

  it('Emits the original denormalized tree shape', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'NAME', operator: 'EQUAL', value: 'Alice' }],
      },
    ];

    expect(emitQuery(ingestQuery(query))).toEqual(query);
  });
});
