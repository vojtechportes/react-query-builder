import { clone } from '../shared/query/model/utils/clone.util';
import { getDescendantIds } from '../shared/query/transformations/utils/get-descendant-ids.util';
import { NormalizedQuery } from '../shared/query/model/types/query-tree';

export const removeSubtree = (
  data: NormalizedQuery,
  nodeId: string
): NormalizedQuery => {
  const idsToRemove = getDescendantIds(data, nodeId);

  if (idsToRemove.length === 0) {
    return data;
  }

  const idSet = new Set(idsToRemove);
  const nextData = clone(data)
    .filter((item) => !idSet.has(item.id))
    .map((item) => {
      if (!('children' in item)) {
        return item;
      }

      item.children = item.children.filter((childId) => !idSet.has(childId));
      return item;
    });

  return nextData;
};
