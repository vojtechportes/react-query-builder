import { isNormalizedGroupNode } from '../shared/query/model/utils/is-normalized-group-node.util';
import { NormalizedQuery } from '../shared/query/model/types/query-tree';
import { findNodeById } from './find-node-by-id';

export interface INodePosition {
  parentId?: string;
  index: number;
}

export const getNodePosition = (
  data: NormalizedQuery,
  nodeId: string
): INodePosition | null => {
  const node = findNodeById(data, nodeId);

  if (!node) {
    return null;
  }

  if (!node.parent) {
    const rootIds = data.filter((item) => !item.parent).map((item) => item.id);
    const index = rootIds.findIndex((id) => id === nodeId);

    return index === -1 ? null : { index };
  }

  const parentNode = findNodeById(data, node.parent);

  if (!parentNode || !isNormalizedGroupNode(parentNode)) {
    return null;
  }

  const index = parentNode.children.findIndex((childId) => childId === nodeId);

  return index === -1
    ? null
    : {
        parentId: node.parent,
        index,
      };
};
