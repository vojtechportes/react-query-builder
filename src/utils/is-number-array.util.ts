import { isArray } from './is-array.util';
import { isNumber } from './is-number.util';

export const isNumberArray = (value: unknown): value is number[] => {
  return isArray<number>(value) && value.every((item) => isNumber(item));
};
