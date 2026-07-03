import { IBuilderFieldChange } from '../builder/types';
import { emitQuery } from './emit-query.util';
import {
  NormalizedQuery,
  QueryRuleValue,
  QueryRuleValueSource,
} from './query-tree';

export const emitBuilderFieldChange = (
  onFieldChange: ((change: IBuilderFieldChange) => void) | undefined,
  data: NormalizedQuery,
  nodeId: string,
  field: string,
  previousValue: QueryRuleValue | undefined,
  value: QueryRuleValue | undefined,
  options: {
    previousValueSource?: QueryRuleValueSource;
    previousValueField?: string;
    valueSource?: QueryRuleValueSource;
    valueField?: string;
  } = {}
) => {
  if (!onFieldChange) {
    return;
  }

  onFieldChange({
    nodeId,
    field,
    previousValueSource: options.previousValueSource,
    previousValue,
    previousValueField: options.previousValueField,
    valueSource: options.valueSource,
    value,
    valueField: options.valueField,
    data: emitQuery(data),
  });
};
