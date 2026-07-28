import { formatCel } from './format-cel';

describe('format-cel', () => {
  it('formats a representative query', () => {
    const formatted = (formatCel as (...args: any[]) => unknown)([
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
