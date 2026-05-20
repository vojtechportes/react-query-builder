import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedCelNode } from './cel-token.types';

const toDenormalizedCelNode = (node: ParsedCelNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedCelNode(child)),
  };

  return group;
};

export const toDenormalizedCelQuery = (
  nodes: ParsedCelNode[]
): DenormalizedQuery => {
  const denormalizedNodes = nodes.map(node => toDenormalizedCelNode(node));

  if (denormalizedNodes.length !== 1) {
    return denormalizedNodes;
  }

  return [denormalizedNodes[0]];
};
