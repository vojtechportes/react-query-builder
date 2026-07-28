import * as subject from './components';

describe('#adapters/antd/v5/components', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['components']);
  });
});
