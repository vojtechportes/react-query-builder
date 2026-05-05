import { clone } from './clone.util';
import { isDenormalizedGroupNode } from './is-denormalized-group-node.util';
import {
  DenormalizedGroupNode,
  IDenormalizedGroupNodeWithModifiers,
  DenormalizedQuery,
  NormalizedGroupNode,
  NormalizedNode,
  NormalizedQuery,
} from './query-tree';

interface ITreeContainer {
  children: DenormalizedQuery;
}

export const normalizeTree = (data: DenormalizedQuery): NormalizedQuery => {
  const clonedData: ITreeContainer = { children: clone(data) };
  const normalizedData: NormalizedQuery = [];

  const run = (item: DenormalizedGroupNode | ITreeContainer, parentId?: string) => {
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
        const normalizedItem: NormalizedGroupNode =
          'value' in childItem &&
          typeof childItem.value !== 'undefined' &&
          'isNegated' in childItem
            ? {
                id: childId,
                parent: childItem.parent,
                type: childItem.type,
                value: (childItem as IDenormalizedGroupNodeWithModifiers).value,
                isNegated: childItem.isNegated,
                readOnly: childItem.readOnly,
                children: [],
              }
            : {
                id: childId,
                parent: childItem.parent,
                type: childItem.type,
                readOnly: childItem.readOnly,
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
