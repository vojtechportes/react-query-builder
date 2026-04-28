import { isArray } from './is-array.util';
import { isString } from './is-string.util';

export interface IOptionListItem {
  value: string;
  label: string;
}

export const isOptionList = (value: unknown): value is IOptionListItem[] => {
  return (
    isArray<IOptionListItem>(value) &&
    value.every(item => isString(item.value) && isString(item.label))
  );
};
