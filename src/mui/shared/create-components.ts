import { IBuilderComponentsProps } from '../../builder';

export const createMuiComponents = (
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
