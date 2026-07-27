import {
  GroupReadOnly,
  GroupReadOnlyTarget,
} from '../shared/query/model/types/query-tree';
import { getGroupReadOnlyTargets } from './resolve-group-read-only.util';

export const isGroupReadOnlyTarget = (
  value: GroupReadOnly | undefined,
  target: GroupReadOnlyTarget
): boolean => getGroupReadOnlyTargets(value).includes(target);
