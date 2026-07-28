import { formatCelRule } from './format-cel-rule';

describe('format-cel-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatCelRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
