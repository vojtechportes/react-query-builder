import * as subject from './components';

describe('#adapters/bootstrap/v5/components', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['components']);
  });
});
