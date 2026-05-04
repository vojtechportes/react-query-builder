import { IBuilderValidationConfig } from '../../builder';

export const normalizeBuilderValidationConfig = <TRule>(
  validation: Partial<TRule> | IBuilderValidationConfig<TRule> | undefined
): IBuilderValidationConfig<TRule> | undefined => {
  if (!validation) {
    return undefined;
  }

  if ('common' in validation || 'rules' in validation) {
    return validation as IBuilderValidationConfig<TRule>;
  }

  return {
    common: validation as Partial<TRule>,
  };
};
