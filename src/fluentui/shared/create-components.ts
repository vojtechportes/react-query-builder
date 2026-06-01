import { IBuilderComponentsProps } from '../../builder';

export const createFluentUiComponents = (
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
