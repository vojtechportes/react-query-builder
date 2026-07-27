import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import {
  isRecipeQuery,
  type IRecipeQueryValidationOptions,
} from './is-recipe-query.util';

export const decodeRecipeQuery = (
  value: string | null,
  options: IRecipeQueryValidationOptions = {}
): DenormalizedQuery => {
  if (!value) throw new Error('The URL does not contain a filter.');
  const parsed: unknown = JSON.parse(value);
  if (!isRecipeQuery(parsed, { maxDepth: 5, maxRules: 20, ...options })) {
    throw new Error('The URL filter has an unsupported structure.');
  }
  return parsed;
};
