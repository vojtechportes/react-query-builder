import { createId } from './create-id.util';
import {
  NormalizedGroupNode,
  QueryGroupType,
} from './query-tree';

export const createGroupNode = (
  groupType: QueryGroupType,
  parent?: string
): NormalizedGroupNode => {
  if (groupType === 'without-modifiers') {
    return {
      type: 'GROUP',
      id: createId(),
      parent,
      children: [],
    };
  }

  return {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: createId(),
    parent,
    children: [],
  };
};
