import { NormalizedQuery } from '../../utils/query-tree';
import { INearestFieldMatch } from '../types/field-option';

export const getNearestFieldMatch = (
  data: NormalizedQuery,
  currentNodeId: string,
  targetFieldName: string
): INearestFieldMatch | undefined => {
  const nodesById = new Map(data.map((node) => [node.id, node]));
  const currentNode = nodesById.get(currentNodeId);

  if (!currentNode) {
    return undefined;
  }

  let currentParentId = currentNode.parent;
  let anchorNodeId = currentNode.id;

  while (currentParentId) {
    const parentNode = nodesById.get(currentParentId);

    if (!parentNode || !('children' in parentNode)) {
      return undefined;
    }

    const anchorIndex = parentNode.children.findIndex(
      (childId) => childId === anchorNodeId
    );

    if (anchorIndex !== -1) {
      for (let distance = 1; distance < parentNode.children.length; distance += 1) {
        const previousChildId = parentNode.children[anchorIndex - distance];

        if (previousChildId) {
          const previousChildNode = nodesById.get(previousChildId);

          if (
            previousChildNode &&
            !('children' in previousChildNode) &&
            previousChildNode.field === targetFieldName
          ) {
            return {
              nodeId: previousChildNode.id,
              field: previousChildNode.field,
              value: previousChildNode.value,
              operator: previousChildNode.operator,
            };
          }
        }

        const nextChildId = parentNode.children[anchorIndex + distance];

        if (nextChildId) {
          const nextChildNode = nodesById.get(nextChildId);

          if (
            nextChildNode &&
            !('children' in nextChildNode) &&
            nextChildNode.field === targetFieldName
          ) {
            return {
              nodeId: nextChildNode.id,
              field: nextChildNode.field,
              value: nextChildNode.value,
              operator: nextChildNode.operator,
            };
          }
        }
      }
    }

    anchorNodeId = parentNode.id;
    currentParentId = parentNode.parent;
  }

  return undefined;
};
