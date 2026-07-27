import { clone } from '../../../shared/query/model/utils/clone.util';
import { getDescendantIds } from '../../../shared/query/transformations/utils/get-descendant-ids.util';
import { NormalizedQuery } from '../../../shared/query/model/types/query-tree';

export const getSubtree = (
  data: NormalizedQuery,
  nodeId: string
): NormalizedQuery => {
  const descendantIds = new Set(getDescendantIds(data, nodeId));

  return clone(data.filter((item) => descendantIds.has(item.id)));
};
