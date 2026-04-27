import { DenormalizedGroupNode, DenormalizedNode } from './query-tree';

export const isDenormalizedGroupNode = (
  item: DenormalizedNode
): item is DenormalizedGroupNode => 'type' in item && item.type === 'GROUP';
