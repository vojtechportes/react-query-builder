import * as React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { doesRecipeRowMatch } from '../utils/does-recipe-row-match.util';
import { toMuiFilterModel } from '../utils/to-mui-filter-model.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'name',
    label: 'Name',
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
    field: 'role',
    label: 'Role',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Admin', value: 'ADMIN' },
      { label: 'Editor', value: 'EDITOR' },
      { label: 'Viewer', value: 'VIEWER' },
    ],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'age', operator: 'LARGER_EQUAL', value: 21 }],
  },
];
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
  { field: 'role', headerName: 'Role', width: 120 },
  { field: 'country', headerName: 'Country', flex: 1, minWidth: 150 },
];

export const MuiDataGridAdvancedFilteringDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const filterModel = React.useMemo(() => toMuiFilterModel(query), [query]);
  const rows = React.useMemo(
    () => recipeDemoRows.filter((row) => doesRecipeRowMatch(row, query)),
    [query]
  );

  return (
    <RecipeDemoFrame
      title="MUI DataGrid advanced filtering"
      note="Changing a rule in the Builder immediately updates the DataGrid."
    >
      <RecipeDemoGroup>
        <RecipeBuilderSurface adapter>
          <Builder
            fields={fields}
            data={query}
            onChange={setQuery}
            components={muiComponents}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <div style={{ height: 390, minWidth: 560 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            filterMode="server"
            filterModel={filterModel}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5]}
          />
        </div>
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default MuiDataGridAdvancedFilteringDemo;
