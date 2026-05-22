import { NormalizedQuery } from '../utils/query-tree';
import { IInsertSubtreeAction } from './types';

export const createInsertSubtreeAction = (
  nodes: NormalizedQuery,
  index: number,
  parentId?: string
): IInsertSubtreeAction => ({
  type: 'insert-subtree',
  parentId,
  index,
  nodes,
});
