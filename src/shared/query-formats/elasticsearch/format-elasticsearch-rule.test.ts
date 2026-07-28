import { formatElasticsearchRule } from './format-elasticsearch-rule';

describe('format-elasticsearch-rule', () => {
  it('formats a representative equality rule', () => {
    const formatted = formatElasticsearchRule({
      field: 'name',
      operator: 'EQUAL',
      value: 'Alice',
    });

    expect(formatted).toMatchSnapshot();
  });
});
