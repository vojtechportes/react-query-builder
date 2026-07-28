import { parseDjango } from './parse-django';

describe('parse-django', () => {
  it('returns query data and inferred fields', () => {
    const result = parseDjango("Q(name='Alice')");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
