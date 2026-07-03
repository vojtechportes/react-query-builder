import { NormalizedQuery } from '../../utils/query-tree';
import { INearestFieldMatch } from '../types/field-option';
import { getRuleValueSource } from '../../utils/rule-value-source';

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
              valueSource: getRuleValueSource(previousChildNode),
              value: previousChildNode.value,
              valueField: previousChildNode.valueField,
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
              valueSource: getRuleValueSource(nextChildNode),
              value: nextChildNode.value,
              valueField: nextChildNode.valueField,
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
