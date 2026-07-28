import { formatElasticsearch } from './format-elasticsearch';

describe('format-elasticsearch', () => {
  it('formats a representative query', () => {
    const formatted = (formatElasticsearch as (...args: any[]) => unknown)([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(formatted).toMatchSnapshot();
  });
});
