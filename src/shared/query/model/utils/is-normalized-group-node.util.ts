import { NormalizedGroupNode, NormalizedNode } from '../types/query-tree';

export const isNormalizedGroupNode = (
  item: NormalizedNode
): item is NormalizedGroupNode => 'type' in item && item.type === 'GROUP';
