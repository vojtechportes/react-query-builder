import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import { NormalizedQuery } from './query-tree';

export const getDescendantIds = (data: NormalizedQuery, id: string): string[] => {
  const ids = [id];

  for (let index = 0; index < ids.length; index += 1) {
    const item = data.find(currentItem => currentItem.id === ids[index]);

    if (item && isNormalizedGroupNode(item)) {
      ids.push(...item.children);
    }
  }

  return ids;
};
