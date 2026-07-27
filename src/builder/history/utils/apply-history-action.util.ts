import { clone } from '../../../shared/query/model/utils/clone.util';
import { NormalizedQuery } from '../../../shared/query/model/types/query-tree';
import { createInsertSubtreeAction } from './create-insert-subtree-action.util';
import { createMoveNodeAction } from './create-move-node-action.util';
import { createRemoveSubtreeAction } from './create-remove-subtree-action.util';
import { createReplaceNodeAction } from './create-replace-node-action.util';
import { createReplaceQueryAction } from './create-replace-query-action.util';
import { findNodeById } from './find-node-by-id.util';
import { getNodePosition } from './get-node-position.util';
import { getSubtree } from './get-subtree.util';
import { insertSubtree } from './insert-subtree.util';
import { moveNode } from './move-node.util';
import { removeSubtree } from './remove-subtree.util';
import { replaceNode } from './replace-node.util';
import { BuilderHistoryAction } from '../types';

export interface IAppliedHistoryAction {
  data: NormalizedQuery;
  inverse: BuilderHistoryAction;
}

export const applyHistoryAction = (
  data: NormalizedQuery,
  action: BuilderHistoryAction
): IAppliedHistoryAction | null => {
  switch (action.type) {
    case 'insert-subtree': {
      const nextData = insertSubtree(
        data,
        action.nodes,
        action.index,
        action.parentId
      );

      if (nextData === data) {
        return null;
      }

      return {
        data: nextData,
        inverse: createRemoveSubtreeAction(action.nodes[0].id),
      };
    }

    case 'remove-subtree': {
      const subtree = getSubtree(data, action.nodeId);
      const position = getNodePosition(data, action.nodeId);

      if (subtree.length === 0 || !position) {
        return null;
      }

      const nextData = removeSubtree(data, action.nodeId);

      if (nextData === data) {
        return null;
      }

      return {
        data: nextData,
        inverse: createInsertSubtreeAction(
          subtree,
          position.index,
          position.parentId
        ),
      };
    }

    case 'replace-node': {
      const currentNode = findNodeById(data, action.nodeId);

      if (!currentNode) {
        return null;
      }

      const nextData = replaceNode(data, action.nodeId, action.node);

      if (nextData === data) {
        return null;
      }

      return {
        data: nextData,
        inverse: createReplaceNodeAction(action.nodeId, clone(currentNode)),
      };
    }

    case 'replace-query': {
      return {
        data: clone(action.data),
        inverse: createReplaceQueryAction(clone(data)),
      };
    }

    case 'move-node': {
      const currentPosition = getNodePosition(data, action.nodeId);

      if (!currentPosition) {
        return null;
      }

      const nextData = moveNode(
        data,
        action.nodeId,
        action.index,
        action.parentId
      );

      if (nextData === data) {
        return null;
      }

      const inverseIndex =
        currentPosition.parentId === action.parentId &&
        action.index <= currentPosition.index
          ? currentPosition.index + 1
          : currentPosition.index;

      return {
        data: nextData,
        inverse: createMoveNodeAction(
          action.nodeId,
          inverseIndex,
          currentPosition.parentId
        ),
      };
    }

    default:
      return null;
  }
};
