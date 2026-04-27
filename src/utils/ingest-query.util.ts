import { assignIds } from './assign-ids.util';
import { createEmptyRootGroup } from './create-empty-root-group.util';
import { normalizeTree } from './normalize-tree.util';
import { DenormalizedQuery, NormalizedQuery } from './query-tree';

export const ingestQuery = (inputQuery: DenormalizedQuery): NormalizedQuery => {
  const queryWithIds = assignIds(inputQuery || []);
  const normalizedInput =
    queryWithIds.length > 0 ? queryWithIds : createEmptyRootGroup();

  try {
    return normalizeTree(normalizedInput);
  } catch (error) {
    throw new Error('Input data tree is in invalid format');
  }
};
