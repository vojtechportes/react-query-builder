import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedDynamoNode } from './dynamo-token.types';

const toDenormalizedDynamoNode = (node: ParsedDynamoNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedDynamoNode(child)),
  };

  return group;
};

export const toDenormalizedDynamoQuery = (
  nodes: ParsedDynamoNode[]
): DenormalizedQuery => nodes.map(node => toDenormalizedDynamoNode(node));
