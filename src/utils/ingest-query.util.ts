import { assignIds } from './assign-ids.util';
import { createEmptyRootGroup } from './create-empty-root-group.util';
import { normalizeTree } from './normalize-tree.util';
import {
  DenormalizedQuery,
  NormalizedQuery,
  QueryGroupType,
} from './query-tree';

export const ingestQuery = (
  inputQuery: DenormalizedQuery,
  rootGroupType: QueryGroupType = 'with-modifiers'
): NormalizedQuery => {
  const queryWithIds = assignIds(inputQuery || []);
  const normalizedInput =
    queryWithIds.length > 0
      ? queryWithIds
      : createEmptyRootGroup(rootGroupType);

  try {
    return normalizeTree(normalizedInput);
  } catch (error) {
    throw new Error('Input data tree is in invalid format');
  }
};
