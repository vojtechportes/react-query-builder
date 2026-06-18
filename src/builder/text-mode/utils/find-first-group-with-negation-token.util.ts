import { ParsedNode } from '../../../query-formats/sql/sql-token.types';

export const findFirstGroupWithNegationToken = (
  nodes: ParsedNode[]
): Extract<ParsedNode, { kind: 'group' }> | null => {
  for (const node of nodes) {
    if (!('kind' in node)) {
      continue;
    }

    if ((node.negationSources?.length || 0) > 0) {
      return node;
    }

    const nestedNegatedGroup = findFirstGroupWithNegationToken(node.children);

    if (nestedNegatedGroup) {
      return nestedNegatedGroup;
    }
  }

  return null;
};
