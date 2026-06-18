import { NormalizedNode, NormalizedQuery } from './query-tree';

export const removeNormalizedQueryNegation = (
  query: NormalizedQuery
): NormalizedQuery => {
  let changed = false;
  const nextQuery = query.map((node: NormalizedNode) => {
    if (!('type' in node) || node.type !== 'GROUP') {
      return node;
    }

    if (typeof node.isNegated === 'undefined' || !node.isNegated) {
      return node;
    }

    changed = true;

    return {
      ...node,
      isNegated: false,
    };
  });

  return changed ? nextQuery : query;
};
