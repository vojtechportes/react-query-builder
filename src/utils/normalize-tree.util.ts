import { clone } from './clone.util';
import { isDenormalizedGroupNode } from './is-denormalized-group-node.util';
import {
  DenormalizedGroupNode,
  DenormalizedQuery,
  NormalizedGroupNode,
  NormalizedNode,
  NormalizedQuery,
} from './query-tree';

interface TreeContainer {
  children: DenormalizedQuery;
}

export const normalizeTree = (data: DenormalizedQuery): NormalizedQuery => {
  const clonedData: TreeContainer = { children: clone(data) };
  const normalizedData: NormalizedQuery = [];

  const run = (item: DenormalizedGroupNode | TreeContainer, parentId?: string) => {
    const children: string[] = [];

    item.children.forEach(childItem => {
      if (parentId) {
        childItem.parent = parentId;
      }

      const childId = childItem.id;

      if (!childId) {
        throw new Error('Input data tree is in invalid format');
      }

      if (isDenormalizedGroupNode(childItem)) {
        const normalizedItem: NormalizedGroupNode = {
          id: childId,
          parent: childItem.parent,
          type: childItem.type,
          value: childItem.value,
          isNegated: childItem.isNegated,
          children: [],
        };

        normalizedData.push(normalizedItem);
        children.push(normalizedItem.id);
        run(childItem, childId);
      } else {
        const normalizedItem: NormalizedNode = {
          ...clone(childItem),
          id: childId,
        };

        normalizedData.push(normalizedItem);
        children.push(normalizedItem.id);
      }
    });

    if (parentId) {
      const parentItem = normalizedData.find(
        normalizedItem => normalizedItem.id === parentId
      );

      if (parentItem && 'children' in parentItem) {
        parentItem.children = children;
      }
    }
  };

  run(clonedData);
  return normalizedData;
};
