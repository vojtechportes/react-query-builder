import { createAntdComponentSet } from './create-antd-component-set';

describe('#adapters/antd/shared/components/create-antd-component-set', () => {
  it('creates the complete adapter component mapping', () => {
    const components = createAntdComponentSet();

    expect(components).toEqual(
      expect.objectContaining({
        Alert: expect.any(Function),
        Add: expect.any(Function),
        Remove: expect.any(Function),
        Rule: expect.any(Function),
        Group: expect.any(Function),
        form: expect.objectContaining({
          Input: expect.any(Function),
          Select: expect.any(Function),
          SelectMulti: expect.any(Function),
          Switch: expect.any(Function),
        }),
      })
    );
  });
});
