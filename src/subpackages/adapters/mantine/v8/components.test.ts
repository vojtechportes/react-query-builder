import * as subject from './components';

describe('#adapters/mantine/v8/components', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(['components']);
  });
});
