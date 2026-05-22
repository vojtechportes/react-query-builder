import { clone } from '../utils/clone.util';
import { findItemIndex } from '../utils/find-item-index.util';
import { getBranchEndIndex } from '../utils/get-branch-end-index.util';
import { isNormalizedGroupNode } from '../utils/is-normalized-group-node.util';
import { NormalizedNode, NormalizedQuery } from '../utils/query-tree';

const getInsertAtIndex = (
  data: NormalizedQuery,
  index: number,
  parentId?: string
): number | null => {
  if (!parentId) {
    const rootNodes = data.filter((item) => !item.parent);

    if (index < 0 || index > rootNodes.length) {
      return null;
    }

    if (index === 0) {
      return 0;
    }

    return getBranchEndIndex(data, rootNodes[index - 1].id) + 1;
  }

  const parentIndex = findItemIndex(data, parentId);

  if (parentIndex === -1) {
    return null;
  }

  const parentNode = data[parentIndex];

  if (!isNormalizedGroupNode(parentNode) || index < 0 || index > parentNode.children.length) {
    return null;
  }

  if (index === 0) {
    return parentIndex + 1;
  }

  return getBranchEndIndex(data, parentNode.children[index - 1]) + 1;
};

export const insertSubtree = (
  data: NormalizedQuery,
  nodes: NormalizedQuery,
  index: number,
  parentId?: string
): NormalizedQuery => {
  if (nodes.length === 0) {
    return data;
  }

  const insertAtIndex = getInsertAtIndex(data, index, parentId);

  if (insertAtIndex === null) {
    return data;
  }

  const nextData = clone(data);
  const subtree = clone(nodes) as NormalizedNode[];
  const rootNode = subtree[0];

  rootNode.parent = parentId;

  if (parentId) {
    const parentIndex = findItemIndex(nextData, parentId);

    if (parentIndex === -1 || !isNormalizedGroupNode(nextData[parentIndex])) {
      return data;
    }

    nextData[parentIndex].children.splice(index, 0, rootNode.id);
  }

  nextData.splice(insertAtIndex, 0, ...subtree);

  return nextData;
};
