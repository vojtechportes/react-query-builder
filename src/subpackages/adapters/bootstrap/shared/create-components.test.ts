import { createBootstrapComponents } from './create-components';

describe('#adapters/bootstrap/shared/create-components', () => {
  it('merges top-level and form component overrides', () => {
    const BaseAdd = () => null;
    const OverrideInput = () => null;
    const base = { Add: BaseAdd, form: {} };
    const overrides = { form: { Input: OverrideInput } };

    expect(createBootstrapComponents(base, overrides)).toMatchObject({
      Add: BaseAdd,
      form: { Input: OverrideInput },
    });
  });
});
