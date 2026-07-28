import * as subject from './odata-token.types';

describe('odata-token.types', () => {
  it('defines keyword and operator runtime contracts', () => {
    expect(Object.keys(subject).length).toBeGreaterThan(0);
    expect(JSON.stringify(Object.values(subject))).toContain('EQUAL');
  });
});
