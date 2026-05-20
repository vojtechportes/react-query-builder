import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedJsonataNode } from './jsonata-token.types';

const toDenormalizedJsonataNode = (
  node: ParsedJsonataNode
): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedJsonataNode(child)),
  };

  return group;
};

export const toDenormalizedJsonataQuery = (
  nodes: ParsedJsonataNode[]
): DenormalizedQuery => {
  const denormalizedNodes = nodes.map(node => toDenormalizedJsonataNode(node));

  if (denormalizedNodes.length !== 1) {
    return denormalizedNodes;
  }

  return [denormalizedNodes[0]];
};

