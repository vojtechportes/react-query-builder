import { createId } from '../../model/utils/create-id.util';
import {
  DenormalizedQuery,
  QueryGroupType,
} from '../../model/types/query-tree';

export const createEmptyRootGroup = (
  groupType: QueryGroupType = 'with-modifiers'
): DenormalizedQuery =>
  groupType === 'without-modifiers'
    ? [
        {
          type: 'GROUP',
          id: createId(),
          children: [],
        },
      ]
    : [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          id: createId(),
          children: [],
        },
      ];
