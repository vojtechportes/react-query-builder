import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDataTable } from '../components/recipe-data-table';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import type { IRecipeDemoRow } from '../types/recipe-demo-row';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { mockSearchOrders } from '../utils/mock-search-orders.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: [
      { label: 'Paid', value: 'PAID' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Refunded', value: 'REFUNDED' },
    ],
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'amount',
    label: 'Amount',
    type: 'NUMBER',
    operators: ['EQUAL', 'NOT_EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'amount', operator: 'LARGER_EQUAL', value: 100 }],
  },
];

export const ServerSideFilteringDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const [rows, setRows] = React.useState<IRecipeDemoRow[]>(() =>
    recipeDemoRows.filter((row) => Number(row.amount) >= 100)
  );
  const [status, setStatus] = React.useState(
    'Showing the initial filtered result.'
  );
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setStatus('Validating filters and refreshing results...');
      try {
        const nextRows = await mockSearchOrders(
          { query, page: 1, pageSize: 5 },
          controller.signal
        );
        setRows(nextRows);
        setStatus(`Mock API returned ${nextRows.length} rows.`);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setRows([]);
        setStatus(
          error instanceof Error ? error.message : 'Mock request failed.'
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <RecipeDemoFrame
      title="Automatic server-side filtering"
      kind="mock"
      note="Changing a filter automatically sends a validated request to a simulated API. A real server must still check which records the current user is allowed to access."
    >
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={query}
            onChange={setQuery}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <p role="status" aria-live="polite" aria-busy={loading}>
          {status}
        </p>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDataTable
          caption="Results from the mock API"
          columns={[
            { field: 'id', label: 'ID' },
            { field: 'status', label: 'Status' },
            { field: 'amount', label: 'Amount' },
            { field: 'region', label: 'Region' },
          ]}
          rows={rows}
        />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default ServerSideFilteringDemo;
