import { NormalizedNode } from '../shared/query/model/types/query-tree';
import { IReplaceNodeAction } from './types';

export const createReplaceNodeAction = (
  nodeId: string,
  node: NormalizedNode
): IReplaceNodeAction => ({
  type: 'replace-node',
  nodeId,
  node,
});
