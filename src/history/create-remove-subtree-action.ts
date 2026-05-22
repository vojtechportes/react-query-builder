import { IRemoveSubtreeAction } from './types';

export const createRemoveSubtreeAction = (
  nodeId: string
): IRemoveSubtreeAction => ({
  type: 'remove-subtree',
  nodeId,
});
