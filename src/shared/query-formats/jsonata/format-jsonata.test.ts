import { formatJsonata } from './format-jsonata';

describe('format-jsonata', () => {
  it('formats a representative query', () => {
    const formatted = (formatJsonata as (...args: any[]) => unknown)([
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
