import { formatDjango } from './format-django';

describe('format-django', () => {
  it('formats a representative query', () => {
    const formatted = (formatDjango as (...args: any[]) => unknown)([
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
