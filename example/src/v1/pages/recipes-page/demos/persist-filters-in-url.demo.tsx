import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { RecipeDemoOutput } from '../components/recipe-demo-output';
import { getInitialRecipeUrlState } from '../utils/get-initial-recipe-url-state.util';
import { encodeRecipeQuery } from '../utils/encode-recipe-query.util';
import { setRecipeFilterParam } from '../utils/set-recipe-filter-param.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Paid', value: 'PAID' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Refunded', value: 'REFUNDED' },
    ],
  },
  {
    field: 'total',
    label: 'Total',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const urlQueryValidation = {
  allowedFields: ['status', 'total'],
  allowedOperators: ['EQUAL', 'NOT_EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
} as const;
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'status', operator: 'EQUAL', value: 'PAID' }],
  },
];

export const PersistFiltersInUrlDemo: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialUrlState] = React.useState(() =>
    getInitialRecipeUrlState(
      searchParams.get('filter'),
      initialQuery,
      urlQueryValidation
    )
  );
  const [error, setError] = React.useState<string | null>(
    initialUrlState.error
  );
  const shouldInitializeSearchParams = React.useRef(
    initialUrlState.shouldRepair
  );
  const [query, setQuery] = React.useState<DenormalizedQuery>(
    initialUrlState.query
  );

  React.useEffect(() => {
    if (!shouldInitializeSearchParams.current) return;
    shouldInitializeSearchParams.current = false;
    setSearchParams(
      (current) => setRecipeFilterParam(current, encodeRecipeQuery(query)),
      { replace: true }
    );
  }, [query, setSearchParams]);

  const updateQuery = (nextQuery: DenormalizedQuery) => {
    setQuery(nextQuery);
    setSearchParams(
      (current) => setRecipeFilterParam(current, encodeRecipeQuery(nextQuery)),
      { replace: true }
    );
  };

  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, [searchParams]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setError(null);
    } catch {
      setError('Clipboard access is unavailable. Copy the URL manually.');
    }
  };

  return (
    <RecipeDemoFrame
      title="Shareable URL filter"
      note="Changing the filter updates only its URL parameter and preserves all other parameters."
      actions={
        <>
          <button type="button" onClick={copy}>
            Copy share URL
          </button>
        </>
      }
    >
      {error ? (
        <RecipeDemoGroup>
          <RecipeDemoOutput label="URL status" value={error} error />
        </RecipeDemoGroup>
      ) : null}
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={query}
            onChange={updateQuery}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDemoOutput label="Current share URL" value={shareUrl} />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default PersistFiltersInUrlDemo;
