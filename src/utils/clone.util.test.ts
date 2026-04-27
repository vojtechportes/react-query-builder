import { clone } from './clone.util';

describe('It tests clone', () => {
  it('Checks whether cloned objects are different', () => {
    const data = { test: 'test' };

    expect(clone(data)).not.toBe(data);
  });
});
