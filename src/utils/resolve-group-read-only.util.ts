import { GroupReadOnly } from './query-tree';
import { isGroupReadOnlyConfig } from './is-group-read-only-config.util';

export interface IResolvedGroupReadOnly {
  enabled: boolean;
  inheritToChildren: boolean;
}

export const resolveGroupReadOnly = (
  value?: GroupReadOnly
): IResolvedGroupReadOnly => {
  if (typeof value === 'boolean') {
    return {
      enabled: value,
      inheritToChildren: false,
    };
  }

  if (isGroupReadOnlyConfig(value)) {
    return {
      enabled: value.enabled,
      inheritToChildren: value.enabled && Boolean(value.inheritToChildren),
    };
  }

  return {
    enabled: false,
    inheritToChildren: false,
  };
};
