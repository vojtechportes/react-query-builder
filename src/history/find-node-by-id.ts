import { findItemIndex } from '../utils/find-item-index.util';
import { NormalizedNode, NormalizedQuery } from '../utils/query-tree';

export const findNodeById = (
  data: NormalizedQuery,
  nodeId: string
): NormalizedNode | undefined => {
  const nodeIndex = findItemIndex(data, nodeId);

  return nodeIndex === -1 ? undefined : data[nodeIndex];
};
