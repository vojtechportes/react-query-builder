import { BuilderFieldValue } from '../builder';
import { isStringOrNumberArray } from './is-string-or-number-array.util';
import { isString } from './is-string.util';
import { isUndefined } from './is-undefined.util';

export const isEmptyBuilderValue = (
  value: BuilderFieldValue | undefined
): boolean => {
  if (isUndefined(value)) {
    return true;
  }

  if (isString(value)) {
    return value.trim() === '';
  }

  if (isStringOrNumberArray(value)) {
    return value.length === 0 || value.some((item) => `${item}`.trim() === '');
  }

  return false;
};
