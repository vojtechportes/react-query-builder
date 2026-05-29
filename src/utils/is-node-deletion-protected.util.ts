import { findNodeById } from '../history/find-node-by-id';
import {
  createInheritedReadOnlyState,
  IInheritedReadOnlyState,
  resolveEffectiveGroupReadOnly,
  resolveEffectiveRuleReadOnly,
} from './resolve-effective-read-only.util';
import { isNormalizedGroupNode } from './is-normalized-group-node.util';
import { NormalizedNode, NormalizedQuery } from './query-tree';

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
): boolean => createDeletionProtectionSet(data).has(nodeId);
