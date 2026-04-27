import { clone } from './clone.util';
import { findItemIndex } from './find-item-index.util';
import { NormalizedNode, NormalizedQuery } from './query-tree';

export const updateItem = (
  data: NormalizedQuery,
  id: string,
  updater: (
    item: NormalizedNode,
    allData: NormalizedQuery,
    itemIndex: number
  ) => void
): NormalizedQuery => {
  const clonedData = clone(data);
  const itemIndex = findItemIndex(clonedData, id);

  if (itemIndex === -1) {
    return clonedData;
  }

  updater(clonedData[itemIndex], clonedData, itemIndex);

  return clonedData;
};
