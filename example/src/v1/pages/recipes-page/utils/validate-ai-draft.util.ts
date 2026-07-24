import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';
import { isRecipeQuery } from './is-recipe-query.util';

export const validateAiDraft = (value: unknown): DenormalizedQuery => {
  if (
    !isRecipeQuery(value, {
      allowedFields: ['status', 'total'],
      allowedOperators: ['EQUAL', 'NOT_EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
      maxDepth: 3,
      maxRules: 6,
    })
  ) {
    throw new Error('The draft failed schema or field/operator validation.');
  }
  return value;
};
