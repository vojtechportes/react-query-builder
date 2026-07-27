import {
  GroupReadOnly,
  IGroupReadOnlyConfig,
} from '../../../shared/query/model/types/query-tree';

export const isGroupReadOnlyConfig = (
  value: GroupReadOnly | undefined
): value is IGroupReadOnlyConfig =>
  typeof value === 'object' && value !== null && 'enabled' in value;
