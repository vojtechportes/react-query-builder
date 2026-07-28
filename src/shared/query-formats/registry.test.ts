import { formatters, parsers } from './registry';

describe('registry', () => {
  it('registers matching parser and formatter contracts for every format', () => {
    expect(Object.keys(formatters)).toEqual(Object.keys(parsers));
    expect(Object.values(formatters)).toEqual(
      expect.arrayContaining([expect.any(Function)])
    );
  });
});
