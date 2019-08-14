import { BuilderFieldOperator } from '../components/Builder';

export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number';
};

export const isUndefined = (value: any): value is undefined => {
  return typeof value === 'undefined';
};

export const isReactText = (value: any): value is React.ReactText => {
  return isString(value) || isNumber(value);
};

export const isReactTextArray = (value: any): value is React.ReactText[] => {
  return typeof value === 'object';
};

export const isOptionList = (
  value: any
): value is Array<{ value: string; label: string }> => {
  return typeof value === 'object';
};

export const isOperator = (value: any): value is BuilderFieldOperator => {
  return !!value;
};
