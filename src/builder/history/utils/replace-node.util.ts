import { clone } from '../../../shared/query/model/utils/clone.util';
import { findItemIndex } from '../../../shared/query/transformations/utils/find-item-index.util';
import { NormalizedQuery } from '../../../shared/query/model/types/query-tree';

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
