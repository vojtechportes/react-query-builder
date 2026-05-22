import { NormalizedNode } from '../utils/query-tree';
import { IReplaceNodeAction } from './types';

export const createReplaceNodeAction = (
  nodeId: string,
  node: NormalizedNode
): IReplaceNodeAction => ({
  type: 'replace-node',
  nodeId,
  node,
});
