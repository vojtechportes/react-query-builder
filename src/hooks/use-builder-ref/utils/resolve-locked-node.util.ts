import { isNormalizedGroupNode } from '../../../utils/is-normalized-group-node.util';
import { NormalizedNode } from '../../../utils/query-tree';
import { updateGroupLockState } from '../../../utils/read-only/update-group-lock-state.util';
import { updateRuleLockState } from '../../../utils/read-only/update-rule-lock-state.util';

export const resolveLockedNode = (
  node: NormalizedNode,
  state: 'unlocked' | 'self' | 'all'
): NormalizedNode => {
  const nextNode = { ...node };

  if (isNormalizedGroupNode(nextNode)) {
    const nextReadOnly = updateGroupLockState(nextNode.readOnly, state);

    if (typeof nextReadOnly === 'undefined') {
      delete nextNode.readOnly;
    } else {
      nextNode.readOnly = nextReadOnly;
    }

    return nextNode;
  }

  const nextReadOnly = updateRuleLockState(
    nextNode.readOnly,
    state === 'self' ? 'self' : 'unlocked'
  );

  if (typeof nextReadOnly === 'undefined') {
    delete nextNode.readOnly;
  } else {
    nextNode.readOnly = nextReadOnly;
  }

  return nextNode;
};
