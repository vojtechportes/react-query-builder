import * as React from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridApi,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import type { IRecipeDemoRow } from '../types/i-recipe-demo-row';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { doesRecipeRowMatch } from '../utils/does-recipe-row-match.util';

ModuleRegistry.registerModules([AllCommunityModule]);

const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Athlete',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  {
    field: 'age',
    label: 'Age',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
  {
    field: 'country',
    label: 'Country',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'age', operator: 'LARGER_EQUAL', value: 18 }],
  },
];
const columns: ColDef<IRecipeDemoRow>[] = [
  { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 170 },
  { field: 'age', width: 90 },
  { field: 'country', flex: 1, minWidth: 150 },
  { field: 'status', width: 120 },
];

export const AgGridQueryBuilderDemo: React.FC = () => {
  const gridApiRef = React.useRef<GridApi<IRecipeDemoRow> | null>(null);
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );

  React.useEffect(() => {
    gridApiRef.current?.onFilterChanged();
  }, [query]);

  return (
    <RecipeDemoFrame
      title="AG Grid external filter"
      note="Changing a rule calls AG Grid's external-filter callbacks. The Builder remains the only filter editor."
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
        <div style={{ height: 390, minWidth: 560 }}>
          <AgGridReact<IRecipeDemoRow>
            theme={themeQuartz}
            rowData={recipeDemoRows}
            columnDefs={columns}
            pagination
            paginationPageSize={5}
            onGridReady={(event) => {
              gridApiRef.current = event.api;
            }}
            isExternalFilterPresent={() =>
              query.some(
                (node) => 'children' in node && node.children.length > 0
              )
            }
            doesExternalFilterPass={(node) =>
              Boolean(node.data && doesRecipeRowMatch(node.data, query))
            }
          />
        </div>
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default AgGridQueryBuilderDemo;
