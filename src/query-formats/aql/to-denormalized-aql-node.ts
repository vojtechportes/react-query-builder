import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedAqlNode } from './aql-token.types';

const toDenormalizedAqlNode = (node: ParsedAqlNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedAqlNode(child)),
  };

  return group;
};

export const toDenormalizedAqlQuery = (
  nodes: ParsedAqlNode[]
): DenormalizedQuery => {
  const denormalizedNodes = nodes.map(node => toDenormalizedAqlNode(node));

  if (denormalizedNodes.length !== 1) {
    return denormalizedNodes;
  }

  const [node] = denormalizedNodes;

  if (!('type' in node)) {
    return [node];
  }

  if (
    node.type === 'GROUP' &&
    !node.isNegated &&
    node.value === 'AND' &&
    node.children.length === 1 &&
    !('type' in node.children[0])
  ) {
    return [node.children[0]];
  }

  return [node];
};

