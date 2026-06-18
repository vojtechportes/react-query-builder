import { ParsedNode } from '../../../query-formats/sql/sql-token.types';

export interface IParsedRuleEntry {
  parentScopeId: string;
  rule: Exclude<ParsedNode, { kind: 'group' }>;
}

export const collectParsedRuleEntries = (
  nodes: ParsedNode[],
  parentScopeId = '__root__'
): IParsedRuleEntry[] =>
  nodes.flatMap((node, index) => {
    if ('kind' in node) {
      return collectParsedRuleEntries(node.children, `${parentScopeId}.${index}`);
    }

    return [{ rule: node, parentScopeId }];
  });
