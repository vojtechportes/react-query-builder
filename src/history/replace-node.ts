import { clone } from '../utils/clone.util';
import { findItemIndex } from '../utils/find-item-index.util';
import { NormalizedQuery } from '../utils/query-tree';

export const replaceNode = (
  data: NormalizedQuery,
  nodeId: string,
  node: NormalizedQuery[number]
): NormalizedQuery => {
  const nodeIndex = findItemIndex(data, nodeId);

  if (nodeIndex === -1) {
    return data;
  }

  const nextData = clone(data);
  nextData[nodeIndex] = clone(node);

  return nextData;
};
