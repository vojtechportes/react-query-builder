import { formatMongo } from './format-mongo';

describe('format-mongo', () => {
  it('formats a representative query', () => {
    const formatted = (formatMongo as (...args: any[]) => unknown)([
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
