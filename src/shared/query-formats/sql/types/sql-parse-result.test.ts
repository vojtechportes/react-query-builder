import type { ISqlParseResult } from './sql-parse-result';

describe('sql-parse-result', () => {
  it('accepts a representative contract value', () => {
    const value: ISqlParseResult = {
      diagnostics: [],
      data: [],
      fields: [],
      parsedNodes: [],
    };

    expect(value).toEqual({
      diagnostics: [],
      data: [],
      fields: [],
      parsedNodes: [],
    });
  });
});
