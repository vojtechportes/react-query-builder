import { formatJsonLogic } from './format-json-logic';

describe('format-json-logic', () => {
  it('formats a representative query', () => {
    const formatted = (formatJsonLogic as (...args: any[]) => unknown)([
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
