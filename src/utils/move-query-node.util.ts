import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import {
  NormalizedGroupNode,
  INormalizedGroupNodeWithModifiers,
  INormalizedGroupNodeWithoutModifiers,
  NormalizedQuery,
  INormalizedRuleNode,
} from './query-tree';

type QueryTreeGroupNode =
  | (Omit<INormalizedGroupNodeWithModifiers, 'children'> & {
      children: QueryTreeNode[];
    })
  | (Omit<INormalizedGroupNodeWithoutModifiers, 'children'> & {
      children: QueryTreeNode[];
    });

type QueryTreeNode = INormalizedRuleNode | QueryTreeGroupNode;

const ROOT_CONTAINER_ID = 'root';

const buildTree = (data: NormalizedQuery): QueryTreeNode[] => {
  const nodeMap = new Map<string, QueryTreeNode>();
  const roots: QueryTreeNode[] = [];

  data.forEach(item => {
    if (isNormalizedGroupNode(item)) {
      nodeMap.set(item.id, { ...item, children: [] });
      return;
    }

    nodeMap.set(item.id, { ...item });
  });

  data.forEach(item => {
    const node = nodeMap.get(item.id);

    if (!node) {
      return;
    }

    if (!item.parent) {
      roots.push(node);
      return;
    }

    const parentNode = nodeMap.get(item.parent);

    if (parentNode && 'children' in parentNode) {
      parentNode.children.push(node);
    }
  });

  return roots;
};

const collectNodeIds = (node: QueryTreeNode): string[] => {
  if (!('children' in node)) {
    return [node.id];
  }

  return [node.id, ...node.children.flatMap(childNode => collectNodeIds(childNode))];
};

const findNode = (
  nodes: QueryTreeNode[],
  nodeId: string
): QueryTreeNode | undefined => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    if ('children' in node) {
      const foundNode = findNode(node.children, nodeId);

      if (foundNode) {
        return foundNode;
      }
    }
  }

  return undefined;
};

const findParentId = (
  nodes: QueryTreeNode[],
  nodeId: string,
  parentId?: string
): string | undefined => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return parentId;
    }

    if ('children' in node) {
      const foundParentId = findParentId(node.children, nodeId, node.id);

      if (typeof foundParentId !== 'undefined') {
        return foundParentId;
      }
    }
  }

  return undefined;
};

const removeNode = (
  nodes: QueryTreeNode[],
  nodeId: string
): QueryTreeNode | null => {
  const nodeIndex = nodes.findIndex(node => node.id === nodeId);

  if (nodeIndex !== -1) {
    const [removedNode] = nodes.splice(nodeIndex, 1);
    return removedNode;
  }

  for (const node of nodes) {
    if ('children' in node) {
      const removedNode = removeNode(node.children, nodeId);

      if (removedNode) {
        return removedNode;
      }
    }
  }

  return null;
};

const getChildrenCollection = (
  nodes: QueryTreeNode[],
  parentId?: string
): QueryTreeNode[] | null => {
  if (!parentId || parentId === ROOT_CONTAINER_ID) {
    return nodes;
  }

  const parentNode = findNode(nodes, parentId);

  if (parentNode && 'children' in parentNode) {
    return parentNode.children;
  }

  return null;
};

const flattenTree = (
  nodes: QueryTreeNode[],
  parentId?: string
): NormalizedQuery => {
  return nodes.flatMap(node => {
    if (!('children' in node)) {
      return [
        {
          ...node,
          parent: parentId,
        },
      ];
    }

    const groupNode: NormalizedGroupNode =
      typeof node.value !== 'undefined' &&
      typeof node.isNegated !== 'undefined'
        ? {
            id: node.id,
            parent: parentId,
            type: node.type,
            value: node.value,
            isNegated: node.isNegated,
            children: node.children.map(childNode => childNode.id),
          }
        : {
            id: node.id,
            parent: parentId,
            type: node.type,
            children: node.children.map(childNode => childNode.id),
          };

    return [groupNode, ...flattenTree(node.children, node.id)];
  });
};

export const moveQueryNode = (
  data: NormalizedQuery,
  activeId: string,
  dropZoneId: string
): NormalizedQuery => {
  if (activeId === dropZoneId || !dropZoneId.startsWith('drop-zone:')) {
    return data;
  }

  const [, destinationParentSegment, destinationIndexSegment] =
    dropZoneId.split(':');
  const destinationParentId =
    destinationParentSegment === ROOT_CONTAINER_ID
      ? undefined
      : destinationParentSegment;
  const destinationIndex = Number(destinationIndexSegment);

  if (Number.isNaN(destinationIndex)) {
    return data;
  }

  const tree = buildTree(data);
  const activeNode = findNode(tree, activeId);

  if (!activeNode) {
    return data;
  }

  const activeNodeIds = collectNodeIds(activeNode);

  if (
    typeof destinationParentId !== 'undefined' &&
    activeNodeIds.includes(destinationParentId)
  ) {
    return data;
  }

  const sourceParentId = findParentId(tree, activeId);
  const sourceCollection = getChildrenCollection(tree, sourceParentId);
  const sourceIndex =
    sourceCollection?.findIndex(node => node.id === activeId) ?? -1;
  const targetCollection = getChildrenCollection(tree, destinationParentId);

  if (!targetCollection || !sourceCollection || sourceIndex === -1) {
    return data;
  }

  let adjustedDestinationIndex = destinationIndex;

  if (
    sourceParentId === destinationParentId &&
    sourceIndex < destinationIndex
  ) {
    adjustedDestinationIndex -= 1;
  }

  const removedNode = removeNode(tree, activeId);

  if (!removedNode) {
    return data;
  }

  const boundedDestinationIndex = Math.max(
    0,
    Math.min(adjustedDestinationIndex, targetCollection.length)
  );

  targetCollection.splice(boundedDestinationIndex, 0, removedNode);

  return flattenTree(tree);
};
