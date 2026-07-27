import { findItemIndex } from './find-item-index.util';
import { isNormalizedGroupNode } from '../../model/utils/is-normalized-group-node.util';
import { NormalizedQuery } from '../../model/types/query-tree';

export const getBranchEndIndex = (
  data: NormalizedQuery,
  id: string
): number => {
  const itemIndex = findItemIndex(data, id);

  if (itemIndex === -1) {
    return data.length - 1;
  }

  const item = data[itemIndex];

  if (
    !isNormalizedGroupNode(item) ||
    !item.children ||
    item.children.length === 0
  ) {
    return itemIndex;
  }

  return getBranchEndIndex(data, item.children[item.children.length - 1]);
};
