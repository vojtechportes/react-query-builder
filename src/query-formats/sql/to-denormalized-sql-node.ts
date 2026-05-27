import type { DenormalizedQuery } from '../../utils/query-tree';
import type { ParsedNode } from './sql-token.types';
import { stripParsedSqlSource } from './utils/strip-parsed-sql-source';

export const toDenormalizedSqlQuery = (
  nodes: ParsedNode[]
): DenormalizedQuery => {
  const denormalizedNodes = stripParsedSqlSource(nodes);

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

