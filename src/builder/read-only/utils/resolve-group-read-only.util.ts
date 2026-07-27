import {
  GroupReadOnly,
  GroupReadOnlyTarget,
} from '../../../shared/query/model/types/query-tree';
import {
  IResolvedGroupReadOnly,
  normalizeGroupReadOnlyConfig,
} from './normalize-group-read-only-config.util';

export const resolveGroupReadOnly = (
  value?: GroupReadOnly
): IResolvedGroupReadOnly => normalizeGroupReadOnlyConfig(value);

export const getGroupReadOnlyTargets = (
  value?: GroupReadOnly
): GroupReadOnlyTarget[] => {
  const resolvedReadOnly = resolveGroupReadOnly(value);

  if (!resolvedReadOnly.enabled) {
    return [];
  }

  return resolvedReadOnly.targets?.length
    ? [...resolvedReadOnly.targets]
    : ['negation', 'combinator'];
};

export const isGroupFullyReadOnly = (value?: GroupReadOnly): boolean => {
  const resolvedReadOnly = resolveGroupReadOnly(value);
  return resolvedReadOnly.enabled && !resolvedReadOnly.targets?.length;
};
