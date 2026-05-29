import {
  GroupReadOnly,
  GroupReadOnlyTarget,
  IGroupReadOnlyConfig,
} from './query-tree';
import { isGroupReadOnlyConfig } from './is-group-read-only-config.util';

export interface IResolvedGroupReadOnly {
  enabled: boolean;
  inheritToChildren: boolean;
  targets?: GroupReadOnlyTarget[];
}

export const normalizeGroupReadOnlyConfig = (
  value?: GroupReadOnly
): IResolvedGroupReadOnly => {
  if (typeof value === 'boolean') {
    return {
      enabled: value,
      inheritToChildren: false,
    };
  }

  if (isGroupReadOnlyConfig(value)) {
    const resolvedValue = value as IGroupReadOnlyConfig;

    return {
      enabled: resolvedValue.enabled,
      inheritToChildren:
        resolvedValue.enabled && Boolean(resolvedValue.inheritToChildren),
      ...(resolvedValue.targets?.length
        ? { targets: [...resolvedValue.targets] }
        : {}),
    };
  }

  return {
    enabled: false,
    inheritToChildren: false,
  };
};
