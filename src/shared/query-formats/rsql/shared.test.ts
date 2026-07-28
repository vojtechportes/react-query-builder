import { parseRsqlScalar, quoteRsqlString } from './shared';

describe('shared', () => {
  it('quotes strings and parses scalar values', () => {
    expect(quoteRsqlString("O'Reilly")).toBe("'O\\'Reilly'");
    expect(parseRsqlScalar('42')).toBe(42);
    expect(parseRsqlScalar('true')).toBe(true);
  });
});
