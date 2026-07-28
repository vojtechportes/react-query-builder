import * as subject from './components';

describe('#adapters/mui/v9/components', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['components']);
  });
});
