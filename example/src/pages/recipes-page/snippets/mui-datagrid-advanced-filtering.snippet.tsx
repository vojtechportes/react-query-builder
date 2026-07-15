import React from 'react';
import {
  DataGrid,
  GridLogicOperator,
  type GridFilterModel,
} from '@mui/x-data-grid';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
  type IDenormalizedRuleNode,
} from '@vojtechportes/react-query-builder';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';

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
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'age', operator: 'LARGER_EQUAL', value: 21 }],
  },
];

const rows = [
  { id: 1, name: 'Ada', age: 36 },
  { id: 2, name: 'Grace', age: 19 },
];

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'age', headerName: 'Age', type: 'number' as const },
];

export const MuiDataGridFilter = () => {
  const [query, setQuery] = React.useState(initialQuery);

  const rules = query.flatMap((node): IDenormalizedRuleNode[] => {
    if (!('type' in node)) return [node];
    return node.children.filter(
      (child): child is IDenormalizedRuleNode => !('type' in child)
    );
  });

  const filterModel: GridFilterModel = {
    logicOperator: GridLogicOperator.And,
    items: rules.map((rule, index) => ({
      id: index,
      field: rule.field,
      operator: rule.operator === 'LARGER_EQUAL' ? '>=' : 'equals',
      value: rule.value,
    })),
  };

  return (
    <>
      <Builder
        fields={fields}
        data={query}
        onChange={setQuery}
        components={muiComponents}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        filterModel={filterModel}
        filterMode="server"
      />
    </>
  );
};
