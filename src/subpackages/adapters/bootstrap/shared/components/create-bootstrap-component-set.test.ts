import { createBootstrapComponentSet } from './create-bootstrap-component-set';

describe('#adapters/bootstrap/shared/components/create-bootstrap-component-set', () => {
  it('creates the complete adapter component mapping', () => {
    const components = createBootstrapComponentSet();

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
