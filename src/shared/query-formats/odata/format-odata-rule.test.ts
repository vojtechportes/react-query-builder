import { formatODataRule } from './format-odata-rule';

describe('format-odata-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatODataRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
