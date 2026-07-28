import { formatAql } from './format-aql';

describe('format-aql', () => {
  it('formats a representative query', () => {
    const formatted = (formatAql as (...args: any[]) => unknown)([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(formatted).toMatchSnapshot();
  });
});
