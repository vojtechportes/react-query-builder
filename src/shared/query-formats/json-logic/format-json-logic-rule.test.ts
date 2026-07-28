import { formatJsonLogicRule } from './format-json-logic-rule';

describe('format-json-logic-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatJsonLogicRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
