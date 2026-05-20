import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedRsqlNode } from './rsql-token.types';

const toDenormalizedRsqlNode = (node: ParsedRsqlNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedRsqlNode(child)),
  };

  return group;
};

export const toDenormalizedRsqlQuery = (
  nodes: ParsedRsqlNode[]
): DenormalizedQuery => nodes.map(node => toDenormalizedRsqlNode(node));
