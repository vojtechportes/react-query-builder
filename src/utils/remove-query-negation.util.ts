import { DenormalizedQuery } from './query-tree';
import { removeDenormalizedNodeNegation } from './remove-denormalized-node-negation.util';

export const removeQueryNegation = (
  query: DenormalizedQuery
): DenormalizedQuery => {
  let changed = false;
  const nextQuery = query.map((node) => {
    const nextNode = removeDenormalizedNodeNegation(node);

    if (nextNode !== node) {
      changed = true;
    }

    return nextNode;
  });

  return changed ? nextQuery : query;
};
