import {
  DenormalizedNode,
  DenormalizedQuery,
} from '../../../shared/query/model/types/query-tree';

const normalizeBuilderTextModeNode = (
  node: DenormalizedNode
): DenormalizedNode => {
  if (!('type' in node) || node.type !== 'GROUP') {
    return node;
  }

  const children = node.children.map((child) =>
    normalizeBuilderTextModeNode(child)
  );

  if (
    typeof node.value !== 'undefined' &&
    typeof node.isNegated !== 'undefined'
  ) {
    return {
      ...node,
      children,
    };
  }

  return {
    ...node,
    value: node.value ?? 'AND',
    isNegated: node.isNegated ?? false,
    children,
  };
};

export const normalizeBuilderTextModeQuery = (
  query: DenormalizedQuery
): DenormalizedQuery => query.map((node) => normalizeBuilderTextModeNode(node));
