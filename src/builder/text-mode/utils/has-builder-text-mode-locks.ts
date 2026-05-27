import { resolveGroupReadOnly } from '../../../utils/resolve-group-read-only.util';
import {
  DenormalizedNode,
  DenormalizedQuery,
  NormalizedNode,
  NormalizedQuery,
} from '../../../utils/query-tree';

const hasLockedNode = (node: DenormalizedNode | NormalizedNode): boolean => {
  if ('type' in node && node.type === 'GROUP') {
    return (
      resolveGroupReadOnly(node.readOnly).enabled ||
      node.children.some(
        child => typeof child !== 'string' && hasLockedNode(child as DenormalizedNode)
      )
    );
  }

  return Boolean(node.readOnly);
};

export const hasBuilderTextModeLocks = (
  data: DenormalizedQuery | NormalizedQuery
): boolean => data.some(node => hasLockedNode(node));
