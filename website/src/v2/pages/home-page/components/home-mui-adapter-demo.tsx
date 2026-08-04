import * as React from 'react';
import { ScopedCssBaseline } from '@mui/material';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
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

export const HomeMuiAdapterDemo: React.FC = () => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialQuery);

  return (
    <ScopedCssBaseline>
      <Builder
        components={muiComponents}
        data={data}
        fields={fields}
        onChange={setData}
        singleRootGroup
        useDefaultContainerStyles={false}
      />
    </ScopedCssBaseline>
  );
};

export default HomeMuiAdapterDemo;
