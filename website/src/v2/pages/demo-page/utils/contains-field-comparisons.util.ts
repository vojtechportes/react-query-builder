import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const containsFieldComparisons = (query: DenormalizedQuery): boolean =>
  query.some((node) =>
    'type' in node
      ? containsFieldComparisons(node.children)
      : node.valueSource === 'field'
  );
