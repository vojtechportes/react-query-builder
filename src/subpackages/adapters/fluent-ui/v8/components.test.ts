import * as subject from './components';

describe('#adapters/fluent-ui/v8/components', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['components']);
  });
});
