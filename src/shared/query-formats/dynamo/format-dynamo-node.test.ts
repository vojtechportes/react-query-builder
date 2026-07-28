import { formatDynamoNode } from './format-dynamo-node';

describe('format-dynamo-node', () => {
  it('formats a nested group node', () => {
    const group = {
      type: 'GROUP',
      value: 'OR',
      isNegated: true,
      children: [
        { field: 'name', operator: 'EQUAL', value: 'Alice' },
        { field: 'city', operator: 'EQUAL', value: 'Prague' },
      ],
    };
    const formatted = (formatDynamoNode as (...args: any[]) => unknown)(
      group,
      'AND'
    );

    expect(formatted).toMatchSnapshot();
  });
});
