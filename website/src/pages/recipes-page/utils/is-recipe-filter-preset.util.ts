import type { IRecipeFilterPreset } from '../types/i-recipe-filter-preset';
import {
  isRecipeQuery,
  type IRecipeQueryValidationOptions,
} from './is-recipe-query.util';

export const isRecipeFilterPreset = (
  value: unknown,
  queryOptions: IRecipeQueryValidationOptions = {}
): value is IRecipeFilterPreset => {
  if (typeof value !== 'object' || value === null) return false;
  const preset = value as Record<string, unknown>;
  return (
    typeof preset.id === 'string' &&
    typeof preset.name === 'string' &&
    preset.name.trim().length > 0 &&
    preset.version === 1 &&
    isRecipeQuery(preset.query, {
      maxDepth: 5,
      maxRules: 20,
      ...queryOptions,
    })
  );
};
