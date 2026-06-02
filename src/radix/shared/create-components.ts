import { IBuilderComponentsProps } from '../../builder';

export const createRadixComponents = (
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
