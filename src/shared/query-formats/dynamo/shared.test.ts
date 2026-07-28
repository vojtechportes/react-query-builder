import { inferDynamoStringOperator, quoteDynamoString } from './shared';

describe('shared', () => {
  it('quotes strings and infers function operators', () => {
    expect(quoteDynamoString("O'Reilly")).toBe("'O\\'Reilly'");
    expect(inferDynamoStringOperator('begins_with', false)).toBe('STARTS_WITH');
  });
});
