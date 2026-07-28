import { isSuspiciousSqlStringClose } from './is-suspicious-sql-string-close';

describe('is-suspicious-sql-string-close', () => {
  it('flags a quote immediately followed by identifier text', () => {
    expect(isSuspiciousSqlStringClose("'Alice'broken", 6)).toBe(true);
  });

  it('allows a quote followed by SQL punctuation or the end of input', () => {
    expect(isSuspiciousSqlStringClose("'Alice',", 6)).toBe(false);
    expect(isSuspiciousSqlStringClose("'Alice'", 6)).toBe(false);
  });
});
