import { isArray } from './is-array.util';
import { isNumber } from './is-number.util';
import { isString } from './is-string.util';

export const isStringOrNumberArray = (
  value: unknown
): value is Array<string | number> => {
  return (
    isArray<string | number>(value) &&
    value.every((item) => isString(item) || isNumber(item))
  );
};
