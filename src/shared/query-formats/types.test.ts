import type { IParseQueryResult, QueryFormat } from './types';

describe('types', () => {
  it('accepts the public query-format contract', () => {
    const format: QueryFormat = 'SQL';
    const result: IParseQueryResult = { data: [], fields: [] };

    expect({ format, result }).toEqual({
      format: 'SQL',
      result: { data: [], fields: [] },
    });
  });
});
