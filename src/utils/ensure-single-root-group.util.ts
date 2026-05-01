import { createEmptyRootGroup } from './create-empty-root-group.util';
import {
  DenormalizedGroupNode,
  DenormalizedQuery,
  QueryGroupType,
} from './query-tree';

export const ensureSingleRootGroup = (
  inputQuery: DenormalizedQuery,
  rootGroupType: QueryGroupType = 'with-modifiers'
): DenormalizedQuery => {
  if (inputQuery.length === 0) {
    return createEmptyRootGroup(rootGroupType);
  }

  if (inputQuery.length === 1 && 'type' in inputQuery[0]) {
    return inputQuery;
  }

  const [rootGroup] = createEmptyRootGroup(rootGroupType);

  return [
    {
      ...(rootGroup as DenormalizedGroupNode),
      children: inputQuery,
    },
  ];
};
