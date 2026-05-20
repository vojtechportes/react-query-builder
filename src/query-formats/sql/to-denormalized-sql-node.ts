import type {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../utils/query-tree';
import type { ParsedNode } from './sql-token.types';

const toDenormalizedSqlNode = (node: ParsedNode): DenormalizedNode => {
  if (!('kind' in node)) {
    return node;
  }

  const group: DenormalizedGroupNode = {
    type: 'GROUP',
    value: node.combinator,
    isNegated: node.isNegated,
    children: node.children.map(child => toDenormalizedSqlNode(child)),
  };

  return group;
};

export const toDenormalizedSqlQuery = (
  nodes: ParsedNode[]
): DenormalizedQuery => {
  const denormalizedNodes = nodes.map(node => toDenormalizedSqlNode(node));

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

