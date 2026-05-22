import { clone } from '../utils/clone.util';
import { createId } from '../utils/create-id.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { NormalizedNode, NormalizedQuery } from '../utils/query-tree';
import { getSubtree } from './get-subtree';

export const createClonedSubtree = (
  data: NormalizedQuery,
  nodeId: string
): NormalizedQuery => {
  const subtree = getSubtree(data, nodeId);
  const subtreeIds = subtree.map((item) => item.id);
  const subtreeIdSet = new Set(subtreeIds);
  const idMap = new Map<string, string>();

  subtreeIds.forEach((subtreeId) => {
    idMap.set(subtreeId, createId());
  });

  return subtree.map((item): NormalizedNode => {
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
};
