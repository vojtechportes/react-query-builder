import { isArray } from './is-array.util';
import { isString } from './is-string.util';

export interface OptionListItem {
  value: string;
  label: string;
}

export const isOptionList = (value: unknown): value is OptionListItem[] => {
  return (
    isArray<OptionListItem>(value) &&
    value.every(item => isString(item.value) && isString(item.label))
  );
};
