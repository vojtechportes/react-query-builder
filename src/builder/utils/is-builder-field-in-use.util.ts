import { NormalizedQuery } from '../../utils/query-tree';

export const isBuilderFieldInUse = (
  data: NormalizedQuery,
  field: string
): boolean => {
  return data.some((node) => 'field' in node && node.field === field);
};
