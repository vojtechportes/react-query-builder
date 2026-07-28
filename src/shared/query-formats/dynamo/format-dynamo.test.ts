import { formatDynamo } from './format-dynamo';

describe('format-dynamo', () => {
  it('formats a representative query', () => {
    const formatted = (formatDynamo as (...args: any[]) => unknown)([
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
