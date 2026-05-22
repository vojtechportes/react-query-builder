import { clone } from './clone.util';
import { createId } from './create-id.util';
import { getBranchEndIndex } from './get-branch-end-index.util';
import { getDescendantIds } from './get-descendant-ids.util';
import { findItemIndex } from './find-item-index.util';
import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import { NormalizedNode, NormalizedQuery } from './query-tree';

export const cloneItem = (data: NormalizedQuery, id: string): NormalizedQuery => {
  const itemIndex = findItemIndex(data, id);

  if (itemIndex === -1) {
    return clone(data);
  }

  const clonedData = clone(data);
  const sourceItem = clonedData[itemIndex];
  const sourceParentId = sourceItem.parent;
  const subtreeIds = getDescendantIds(clonedData, id);
  const subtreeIdSet = new Set(subtreeIds);
  const idMap = new Map<string, string>();

  subtreeIds.forEach((subtreeId) => {
    idMap.set(subtreeId, createId());
  });

  const clonedSubtree = clonedData
    .filter((item) => subtreeIdSet.has(item.id))
    .map((item): NormalizedNode => {
      const nextItem = clone(item) as NormalizedNode;

      nextItem.id = idMap.get(item.id) || nextItem.id;
      nextItem.parent =
        item.parent && subtreeIdSet.has(item.parent)
          ? idMap.get(item.parent)
          : item.parent;

      if (isNormalizedGroupNode(nextItem)) {
        nextItem.children = nextItem.children.map(
          (childId) => idMap.get(childId) || childId
        );
      }

      return nextItem;
    });

  if (sourceParentId) {
    const parentIndex = findItemIndex(clonedData, sourceParentId);

    if (parentIndex !== -1 && isNormalizedGroupNode(clonedData[parentIndex])) {
      const parent = clonedData[parentIndex];
      const childIndex = parent.children.findIndex((childId) => childId === id);

      if (childIndex !== -1) {
        parent.children.splice(childIndex + 1, 0, idMap.get(id) || id);
      }
    }
  }

  const insertIndex = getBranchEndIndex(clonedData, id);
  clonedData.splice(insertIndex + 1, 0, ...clonedSubtree);

  return clonedData;
};
