import { formatJsonLogicNode } from './format-json-logic-node';

describe('format-json-logic-node', () => {
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
    const formatted = (formatJsonLogicNode as (...args: any[]) => unknown)(
      group,
      'AND'
    );

    expect(formatted).toMatchSnapshot();
  });
});
