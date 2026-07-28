import { formatDjangoNode } from './format-django-node';

describe('format-django-node', () => {
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
    const formatted = (formatDjangoNode as (...args: any[]) => unknown)(
      group,
      'AND'
    );

    expect(formatted).toMatchSnapshot();
  });
});
