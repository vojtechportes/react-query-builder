import { findNodeById } from '../history/find-node-by-id';
import {
  createInheritedReadOnlyState,
  IInheritedReadOnlyState,
  resolveEffectiveGroupReadOnly,
  resolveEffectiveRuleReadOnly,
} from './resolve-effective-read-only.util';
import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import { NormalizedGroupNode, NormalizedNode, NormalizedQuery } from './query-tree';

const isNodeOwnReadOnlyProtected = (
  node: NormalizedNode,
  inheritedReadOnly: IInheritedReadOnlyState
): {
  protected: boolean;
  nextInheritedReadOnly: IInheritedReadOnlyState;
} => {
  if (isNormalizedGroupNode(node)) {
    const resolvedReadOnly = resolveEffectiveGroupReadOnly(
      node.readOnly,
      inheritedReadOnly
    );

    return {
      protected: resolvedReadOnly.full || resolvedReadOnly.targets.length > 0,
      nextInheritedReadOnly: resolvedReadOnly.inherited,
    };
  }

  const resolvedReadOnly = resolveEffectiveRuleReadOnly(
    node.readOnly,
    inheritedReadOnly
  );

  return {
    protected: resolvedReadOnly.full || resolvedReadOnly.targets.length > 0,
    nextInheritedReadOnly: inheritedReadOnly,
  };
};

const populateDeletionProtection = (
  data: NormalizedQuery,
  node: NormalizedNode,
  protectedIds: Set<string>,
  inheritedReadOnly: IInheritedReadOnlyState
): boolean => {
  const { protected: isOwnProtected, nextInheritedReadOnly } =
    isNodeOwnReadOnlyProtected(node, inheritedReadOnly);

  let hasProtectedDescendant = false;

  if (isNormalizedGroupNode(node)) {
    hasProtectedDescendant = node.children.some((childId) => {
      const childNode = findNodeById(data, childId);

      if (!childNode) {
        return false;
      }

      return populateDeletionProtection(
        data,
        childNode,
        protectedIds,
        nextInheritedReadOnly
      );
    });
  }

  const isProtected = isOwnProtected || hasProtectedDescendant;

  if (isProtected) {
    protectedIds.add(node.id);
  }

  return isProtected;
};

const resolveInheritedReadOnlyForNode = (
  data: NormalizedQuery,
  node: NormalizedNode
): IInheritedReadOnlyState => {
  const ancestorGroups: NormalizedGroupNode[] = [];
  let currentParentId = node.parent;

  while (currentParentId) {
    const parentNode = findNodeById(data, currentParentId);

    if (!parentNode || !isNormalizedGroupNode(parentNode)) {
      break;
    }

    ancestorGroups.unshift(parentNode);
    currentParentId = parentNode.parent;
  }

  return ancestorGroups.reduce<IInheritedReadOnlyState>(
    (inheritedReadOnly, ancestorGroup) =>
      resolveEffectiveGroupReadOnly(ancestorGroup.readOnly, inheritedReadOnly)
        .inherited,
    createInheritedReadOnlyState()
  );
};

const hasProtectedNodeInSubtree = (
  data: NormalizedQuery,
  node: NormalizedNode,
  inheritedReadOnly: IInheritedReadOnlyState
): boolean => {
  const { protected: isOwnProtected, nextInheritedReadOnly } =
    isNodeOwnReadOnlyProtected(node, inheritedReadOnly);

  if (isOwnProtected) {
    return true;
  }

  if (!isNormalizedGroupNode(node)) {
    return false;
  }

  return node.children.some((childId) => {
    const childNode = findNodeById(data, childId);

    if (!childNode) {
      return false;
    }

    return hasProtectedNodeInSubtree(
      data,
      childNode,
      nextInheritedReadOnly
    );
  });
};

export const createDeletionProtectionSet = (
  data: NormalizedQuery
): Set<string> => {
  const protectedIds = new Set<string>();
  const rootInheritedReadOnly = createInheritedReadOnlyState();

  data
    .filter((node) => !node.parent)
    .forEach((node) => {
      populateDeletionProtection(
        data,
        node,
        protectedIds,
        rootInheritedReadOnly
      );
    });

  return protectedIds;
};

export const isNodeDeletionProtected = (
  data: NormalizedQuery,
  nodeId: string
): boolean => {
  const node = findNodeById(data, nodeId);

  if (!node) {
    return false;
  }

  return hasProtectedNodeInSubtree(
    data,
    node,
    resolveInheritedReadOnlyForNode(data, node)
  );
};
