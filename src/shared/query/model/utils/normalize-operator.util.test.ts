import { normalizeOperator } from './normalize-operator.util';

describe('normalizeOperator', () => {
  it('Normalizes deprecated aliases to semantic operators', () => {
    expect(normalizeOperator('ANY_IN')).toEqual('IN');
    expect(normalizeOperator('LIKE')).toEqual('CONTAINS');
    expect(normalizeOperator('NOT_LIKE')).toEqual('NOT_CONTAINS');
  });

  it('Keeps non-deprecated operators unchanged', () => {
    expect(normalizeOperator('IN')).toEqual('IN');
    expect(normalizeOperator('CONTAINS')).toEqual('CONTAINS');
    expect(normalizeOperator('STARTS_WITH')).toEqual('STARTS_WITH');
  });
});
