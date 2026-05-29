import { GroupReadOnly, GroupReadOnlyTarget } from './query-tree';
import { getGroupReadOnlyTargets } from './resolve-group-read-only.util';

export const isGroupReadOnlyTarget = (
  value: GroupReadOnly | undefined,
  target: GroupReadOnlyTarget
): boolean => getGroupReadOnlyTargets(value).includes(target);
