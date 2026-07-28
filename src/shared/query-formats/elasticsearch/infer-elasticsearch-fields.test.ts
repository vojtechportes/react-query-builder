import { inferElasticsearchFields } from './infer-elasticsearch-fields';

describe('infer-elasticsearch-fields', () => {
  it('infers the field used by a representative rule', () => {
    const fields = inferElasticsearchFields([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'name', operator: 'EQUAL', value: 'Alice' }],
      },
    ]);

    expect(fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
