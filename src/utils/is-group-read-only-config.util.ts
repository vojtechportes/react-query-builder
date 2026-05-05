import { GroupReadOnly, IGroupReadOnlyConfig } from './query-tree';

export const isGroupReadOnlyConfig = (
  value: GroupReadOnly | undefined
): value is IGroupReadOnlyConfig =>
  typeof value === 'object' && value !== null && 'enabled' in value;
