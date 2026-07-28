import { formatSql } from './format-sql';

describe('format-sql', () => {
  it('formats a representative query', () => {
    const formatted = (formatSql as (...args: any[]) => unknown)([
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
