import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { cloneRecipeQuery } from './clone-recipe-query.util';
import { decodeRecipeQuery } from './decode-recipe-query.util';
import type { IRecipeQueryValidationOptions } from './is-recipe-query.util';

export interface IInitialRecipeUrlState {
  error: string | null;
  query: DenormalizedQuery;
  shouldRepair: boolean;
}

export const getInitialRecipeUrlState = (
  value: string | null,
  initialQuery: DenormalizedQuery,
  validation: IRecipeQueryValidationOptions
): IInitialRecipeUrlState => {
  if (!value) {
    return {
      error: null,
      query: cloneRecipeQuery(initialQuery),
      shouldRepair: true,
    };
  }

  try {
    return {
      error: null,
      query: decodeRecipeQuery(value, validation),
      shouldRepair: false,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid URL filter.',
      query: cloneRecipeQuery(initialQuery),
      shouldRepair: true,
    };
  }
};
