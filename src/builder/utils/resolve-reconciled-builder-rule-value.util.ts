import type {
  BuilderFieldOption,
  BuilderFieldType,
  IBuilderRuleValueReconciliationConfig,
} from '../types';
import type { QueryRuleValue } from '../../utils/query-tree';

export const resolveReconciledBuilderRuleValue = (
  fieldType: BuilderFieldType,
  value: QueryRuleValue | undefined,
  options: BuilderFieldOption[],
  config: IBuilderRuleValueReconciliationConfig
): QueryRuleValue | undefined => {
  if (config.strategy !== 'clear-if-missing') {
    return value;
  }

  const allowedValues = new Set(options.map((option) => String(option.value)));

  if (fieldType === 'LIST') {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return undefined;
    }

    return allowedValues.has(String(value)) ? value : undefined;
  }

  if (fieldType === 'MULTI_LIST') {
    if (!Array.isArray(value)) {
      return [];
    }

    if (value.every((item) => typeof item === 'number')) {
      return value.filter((item): item is number => allowedValues.has(String(item)));
    }

    return value.filter((item): item is string => allowedValues.has(String(item)));
  }

  return value;
};
