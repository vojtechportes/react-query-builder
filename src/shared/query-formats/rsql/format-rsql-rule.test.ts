import { formatRsqlRule } from './format-rsql-rule';

describe('format-rsql-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatRsqlRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
