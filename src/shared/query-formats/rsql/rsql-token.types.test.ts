import * as subject from './rsql-token.types';

describe('rsql-token.types', () => {
  it('defines keyword and operator runtime contracts', () => {
    expect(Object.keys(subject).length).toBeGreaterThan(0);
    expect(JSON.stringify(Object.values(subject))).toContain('EQUAL');
  });
});
