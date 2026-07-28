import { formatOData } from './format-odata';

describe('format-odata', () => {
  it('formats a representative query', () => {
    const formatted = (formatOData as (...args: any[]) => unknown)([
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
