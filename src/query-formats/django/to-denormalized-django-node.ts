import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedDjangoNode } from './django-token.types';

const toDenormalizedDjangoNode = (node: ParsedDjangoNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedDjangoNode(child)),
  };

  return group;
};

export const toDenormalizedDjangoQuery = (
  nodes: ParsedDjangoNode[]
): DenormalizedQuery => nodes.map(node => toDenormalizedDjangoNode(node));
