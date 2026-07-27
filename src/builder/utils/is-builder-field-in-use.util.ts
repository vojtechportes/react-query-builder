import { NormalizedQuery } from '../../shared/query/model/types/query-tree';

export const isBuilderFieldInUse = (
  data: NormalizedQuery,
  field: string
): boolean => {
  return data.some((node) => 'field' in node && node.field === field);
};
