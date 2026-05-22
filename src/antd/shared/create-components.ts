import { IBuilderComponentsProps } from '../../builder';

export const createAntdComponents = (
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
