import { IMoveNodeAction } from './types';

export const createMoveNodeAction = (
  nodeId: string,
  index: number,
  parentId?: string
): IMoveNodeAction => ({
  type: 'move-node',
  nodeId,
  parentId,
  index,
});
