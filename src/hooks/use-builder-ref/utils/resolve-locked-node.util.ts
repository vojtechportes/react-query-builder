import { isNormalizedGroupNode } from '../../../utils/is-normalized-group-node.util';
import { NormalizedNode } from '../../../utils/query-tree';

export const resolveLockedNode = (
  node: NormalizedNode,
  state: 'unlocked' | 'self' | 'all'
): NormalizedNode => {
  const nextNode = { ...node };

  if (isNormalizedGroupNode(nextNode)) {
    if (state === 'all') {
      nextNode.readOnly = {
        enabled: true,
        inheritToChildren: true,
      };
    } else if (state === 'self') {
      nextNode.readOnly = true;
    } else {
      delete nextNode.readOnly;
    }

    return nextNode;
  }

  if (state === 'self') {
    nextNode.readOnly = true;
  } else {
    delete nextNode.readOnly;
  }

  return nextNode;
};
