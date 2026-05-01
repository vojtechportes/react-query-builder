import { emitQuery } from './emit-query.util';
import { ingestQuery } from './ingest-query.util';

describe('ingestQuery', () => {
  it('Wraps root-level rules in a single root group when singleRootGroup is enabled', () => {
    const normalizedQuery = ingestQuery(
      [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
      'with-modifiers',
      true
    );

    const emittedQuery = emitQuery(normalizedQuery);

    expect(emittedQuery).toHaveLength(1);
    expect(emittedQuery[0]).toMatchObject({
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
    });
  });

  it('Wraps multiple root items in a single root group when singleRootGroup is enabled', () => {
    const normalizedQuery = ingestQuery(
      [
        { field: 'FIRST_FIELD', value: '', operator: 'EQUAL' },
        { field: 'SECOND_FIELD', value: '', operator: 'EQUAL' },
      ],
      'without-modifiers',
      true
    );

    const emittedQuery = emitQuery(normalizedQuery);

    expect(emittedQuery).toHaveLength(1);
    expect(emittedQuery[0]).toMatchObject({
      type: 'GROUP',
      children: [
        { field: 'FIRST_FIELD', value: '', operator: 'EQUAL' },
        { field: 'SECOND_FIELD', value: '', operator: 'EQUAL' },
      ],
    });
    expect('value' in emittedQuery[0]).toEqual(false);
    expect('isNegated' in emittedQuery[0]).toEqual(false);
  });
});
