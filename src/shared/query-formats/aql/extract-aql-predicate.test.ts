import {
  extractAqlPredicate,
  stripAqlVariableName,
} from './extract-aql-predicate';

describe('extract-aql-predicate', () => {
  it('extracts a wrapped filter and its variable name', () => {
    expect(
      extractAqlPredicate(
        "FOR item IN users FILTER item.name == 'Alice' RETURN item"
      )
    ).toEqual({
      predicate: "item.name == 'Alice'",
      variableName: 'item',
    });
  });

  it('strips only the configured variable prefix', () => {
    expect(stripAqlVariableName('item.name', 'item')).toBe('name');
    expect(stripAqlVariableName('profile.name', 'item')).toBe('profile.name');
  });
});
