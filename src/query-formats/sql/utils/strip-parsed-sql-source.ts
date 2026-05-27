import { DenormalizedNode, DenormalizedQuery } from '../../../utils/query-tree';
import { ParsedNode } from '../sql-token.types';

const stripParsedSqlNodeSource = (node: ParsedNode): DenormalizedNode => {
  if ('kind' in node) {
    return {
      type: 'GROUP',
      value: node.combinator,
      isNegated: node.isNegated,
      children: node.children.map((child) => stripParsedSqlNodeSource(child)),
    };
  }

  const { source, ...rule } = node;
  void source;

  return rule;
};

export const stripParsedSqlSource = (nodes: ParsedNode[]): DenormalizedQuery =>
  nodes.map((node) => stripParsedSqlNodeSource(node));
