import { clone } from '../utils/clone.util';
import { getDescendantIds } from '../utils/get-descendant-ids.util';
import { NormalizedQuery } from '../utils/query-tree';

export const getSubtree = (
  data: NormalizedQuery,
  nodeId: string
): NormalizedQuery => {
  const descendantIds = new Set(getDescendantIds(data, nodeId));

  return clone(data.filter((item) => descendantIds.has(item.id)));
};
