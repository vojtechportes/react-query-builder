import { formatJsonataRule } from './format-jsonata-rule';

describe('format-jsonata-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatJsonataRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
