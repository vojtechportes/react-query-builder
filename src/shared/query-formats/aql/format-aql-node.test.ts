import { formatAqlNode } from './format-aql-node';

describe('format-aql-node', () => {
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
    const formatted = (formatAqlNode as (...args: any[]) => unknown)(
      group,
      'doc',
      'AND'
    );

    expect(formatted).toMatchSnapshot();
  });
});
