import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedODataNode } from './odata-token.types';

const toDenormalizedODataNode = (node: ParsedODataNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedODataNode(child)),
  };

  return group;
};

export const toDenormalizedODataQuery = (
  nodes: ParsedODataNode[]
): DenormalizedQuery => {
  const denormalizedNodes = nodes.map(node => toDenormalizedODataNode(node));

  if (denormalizedNodes.length !== 1) {
    return denormalizedNodes;
  }

  return [denormalizedNodes[0]];
};
