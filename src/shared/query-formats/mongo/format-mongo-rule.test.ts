import { formatMongoRule } from './format-mongo-rule';

describe('format-mongo-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatMongoRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
