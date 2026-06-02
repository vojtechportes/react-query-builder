import { IBuilderComponentsProps } from '../../builder';

export const createBootstrapComponents = (
  base: IBuilderComponentsProps,
  overrides?: IBuilderComponentsProps
): IBuilderComponentsProps => ({
  ...base,
  ...overrides,
  form: {
    ...base.form,
    ...overrides?.form,
  },
});
