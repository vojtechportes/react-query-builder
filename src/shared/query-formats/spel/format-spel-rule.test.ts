import { formatSpelRule } from './format-spel-rule';

describe('format-spel-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatSpelRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
