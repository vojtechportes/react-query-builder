import React from 'react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type GridApi,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

ModuleRegistry.registerModules([AllCommunityModule]);

const fields: IBuilderFieldProps[] = [
  {
    field: 'athlete',
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
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'age', operator: 'LARGER_EQUAL', value: 18 }],
  },
];

const rows = [
  { athlete: 'Ada', age: 36 },
  { athlete: 'Grace', age: 17 },
];

export const AgGridExternalFilter = () => {
  const apiRef = React.useRef<GridApi | null>(null);
  const [query, setQuery] = React.useState(initialQuery);

  React.useEffect(() => apiRef.current?.onFilterChanged(), [query]);

  const rule = 'type' in query[0] ? query[0].children[0] : query[0];

  const matches = (row: (typeof rows)[number]) =>
    !rule || 'type' in rule || Number(row.age) >= Number(rule.value);

  return (
    <>
      <Builder fields={fields} data={query} onChange={setQuery} />
      <AgGridReact
        rowData={rows}
        columnDefs={[{ field: 'athlete' }, { field: 'age' }]}
        onGridReady={(event) => (apiRef.current = event.api)}
        isExternalFilterPresent={() => Boolean(rule)}
        doesExternalFilterPass={(node) =>
          Boolean(node.data && matches(node.data))
        }
      />
    </>
  );
};
