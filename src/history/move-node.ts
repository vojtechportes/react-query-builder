import { getDescendantIds } from '../utils/get-descendant-ids.util';
import { NormalizedQuery } from '../utils/query-tree';
import { getNodePosition } from './get-node-position';
import { getSubtree } from './get-subtree';
import { insertSubtree } from './insert-subtree';
import { removeSubtree } from './remove-subtree';

export const moveNode = (
  data: NormalizedQuery,
  nodeId: string,
  index: number,
  parentId?: string
): NormalizedQuery => {
  const sourcePosition = getNodePosition(data, nodeId);

  if (!sourcePosition) {
    return data;
  }

  if (sourcePosition.parentId === parentId && sourcePosition.index === index) {
    return data;
  }

  if (parentId) {
    const subtreeIds = new Set(getDescendantIds(data, nodeId));

    if (subtreeIds.has(parentId)) {
      return data;
    }
  }

  const subtree = getSubtree(data, nodeId);

  if (subtree.length === 0) {
    return data;
  }

  const dataWithoutSubtree = removeSubtree(data, nodeId);
  const adjustedIndex =
    sourcePosition.parentId === parentId && sourcePosition.index < index
      ? index - 1
      : index;

  return insertSubtree(dataWithoutSubtree, subtree, adjustedIndex, parentId);
};
