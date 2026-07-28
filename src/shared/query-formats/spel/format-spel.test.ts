import { formatSpel } from './format-spel';

describe('format-spel', () => {
  it('formats a representative query', () => {
    const formatted = (formatSpel as (...args: any[]) => unknown)([
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
