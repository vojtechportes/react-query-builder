import { parseDynamo } from './parse-dynamo';

describe('parse-dynamo', () => {
  it('returns query data and inferred fields', () => {
    const result = parseDynamo("name = 'Alice'");

    expect(result.data).toEqual([
      { field: 'name', operator: 'EQUAL', value: 'Alice' },
    ]);
    expect(result.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    );
  });
});
