import type { QueryOperator } from '../../utils/query-tree';

export interface IJsonLogicVar {
  var: string;
}

export type JsonLogicArray = JsonLogicPrimitive[];

export type JsonLogicPrimitive = string | number | boolean | null;
export type JsonLogicRule =
  | JsonLogicPrimitive
  | JsonLogicArray
  | IJsonLogicVar
  | { [operator: string]: JsonLogicRule | JsonLogicRule[] };

export const createVarRule = (field: string): IJsonLogicVar => ({
  var: field,
});

export const isVarRule = (value: unknown): value is IJsonLogicVar =>
  typeof value === 'object' &&
  value !== null &&
  'var' in value &&
  typeof (value as { var: unknown }).var === 'string';

export const isJsonLogicObject = (
  value: unknown
): value is { [operator: string]: unknown } =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isJsonLogicArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

export const inferJsonLogicStringOperator = (
  kind: 'contains' | 'starts' | 'ends',
  negated = false
): QueryOperator => {
  if (kind === 'contains') {
    return negated ? 'NOT_CONTAINS' : 'CONTAINS';
  }

  if (kind === 'starts') {
    return 'STARTS_WITH';
  }

  return 'ENDS_WITH';
};
