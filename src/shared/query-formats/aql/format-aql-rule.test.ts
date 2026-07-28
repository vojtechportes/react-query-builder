import { formatAqlRule } from './format-aql-rule';

describe('format-aql-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatAqlRule(
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
      'doc'
    );

    expect(formatted).toMatchSnapshot();
  });
});
