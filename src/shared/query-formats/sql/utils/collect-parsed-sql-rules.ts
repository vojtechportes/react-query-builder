import { IParsedSqlRuleNode } from '../types/parsed-sql-rule-node';
import { ParsedNode } from '../sql-token.types';

export const collectParsedSqlRules = (
  nodes: ParsedNode[]
): IParsedSqlRuleNode[] =>
  nodes.flatMap((node) => {
    if ('kind' in node) {
      return collectParsedSqlRules(node.children);
    }

    return [node];
  });
