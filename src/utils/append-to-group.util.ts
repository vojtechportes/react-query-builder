import { getBranchEndIndex } from './get-branch-end-index.util';
import { NormalizedNode, NormalizedQuery } from './query-tree';
import { updateItem } from './update-item.util';

export const appendToGroup = (
  data: NormalizedQuery,
  groupId: string,
  itemToInsert: NormalizedNode
): NormalizedQuery =>
  updateItem(data, groupId, (group, allData, groupIndex) => {
    if (!('children' in group)) {
      return;
    }

    const insertAfterIndex =
      group.children.length > 0
        ? getBranchEndIndex(allData, group.children[group.children.length - 1])
        : groupIndex;

    group.children.push(itemToInsert.id);
    allData.splice(insertAfterIndex + 1, 0, itemToInsert);
  });
