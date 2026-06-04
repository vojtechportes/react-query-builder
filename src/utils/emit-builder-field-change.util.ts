import { IBuilderFieldChange } from '../builder/types';
import { emitQuery } from './emit-query.util';
import { NormalizedQuery, QueryRuleValue } from './query-tree';

export const emitBuilderFieldChange = (
  onFieldChange: ((change: IBuilderFieldChange) => void) | undefined,
  data: NormalizedQuery,
  nodeId: string,
  field: string,
  previousValue: QueryRuleValue | undefined,
  value: QueryRuleValue | undefined
) => {
  if (!onFieldChange) {
    return;
  }

  onFieldChange({
    nodeId,
    field,
    previousValue,
    value,
    data: emitQuery(data),
  });
};
