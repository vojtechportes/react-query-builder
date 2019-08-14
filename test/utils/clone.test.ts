import { clone } from '../../src/utils/clone';

describe('It tests clone', () => {
  it('Checks whether cloned objects are different', () => {
    const data = { test: 'test' };

    expect(clone(data)).not.toBe(data);
  });
});
