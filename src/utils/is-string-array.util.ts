import { isArray } from './is-array.util';
import { isString } from './is-string.util';

export const isStringArray = (value: unknown): value is string[] => {
  return isArray<string>(value) && value.every(item => isString(item));
};
