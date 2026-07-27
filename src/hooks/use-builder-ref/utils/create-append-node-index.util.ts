import { isNormalizedGroupNode } from '../../../shared/query/model/utils/is-normalized-group-node.util';
import { NormalizedQuery } from '../../../shared/query/model/types/query-tree';
import { findNodeById } from '../../../history/find-node-by-id';

export const createAppendNodeIndex = (
  data: NormalizedQuery,
  parentId?: string
): number | null => {
  if (!parentId) {
    return data.filter((item) => !item.parent).length;
  }

  const parentNode = findNodeById(data, parentId);

  if (!parentNode || !isNormalizedGroupNode(parentNode)) {
    return null;
  }

  return parentNode.children.length;
};
