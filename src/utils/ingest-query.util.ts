import { assignIds } from './assign-ids.util';
import { createEmptyRootGroup } from './create-empty-root-group.util';
import { ensureSingleRootGroup } from './ensure-single-root-group.util';
import { normalizeTree } from './normalize-tree.util';
import {
  DenormalizedQuery,
  NormalizedQuery,
  QueryGroupType,
} from './query-tree';

export const ingestQuery = (
  inputQuery: DenormalizedQuery,
  rootGroupType: QueryGroupType = 'with-modifiers',
  singleRootGroup = false
): NormalizedQuery => {
  const queryWithIds = assignIds(inputQuery || []);
  const preparedInput = singleRootGroup
    ? ensureSingleRootGroup(queryWithIds, rootGroupType)
    : queryWithIds;
  const normalizedInput =
    preparedInput.length > 0
      ? preparedInput
      : createEmptyRootGroup(rootGroupType);

  try {
    return normalizeTree(normalizedInput);
  } catch (error) {
    throw new Error('Input data tree is in invalid format');
  }
};
