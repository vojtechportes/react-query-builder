import { clone } from './clone.util';
import { getDescendantIds } from './get-descendant-ids.util';
import { NormalizedQuery } from './query-tree';

export const removeItem = (data: NormalizedQuery, id: string): NormalizedQuery => {
  const clonedData = clone(data);
  const idsToRemove = getDescendantIds(clonedData, id);

  return clonedData
    .filter(item => !idsToRemove.includes(item.id))
    .map(item => {
      if (!('children' in item)) {
        return item;
      }

      item.children = item.children.filter(
        childId => !idsToRemove.includes(childId)
      );

      return item;
    });
};
