import { formatRsql } from './format-rsql';

describe('format-rsql', () => {
  it('formats a representative query', () => {
    const formatted = (formatRsql as (...args: any[]) => unknown)([
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
