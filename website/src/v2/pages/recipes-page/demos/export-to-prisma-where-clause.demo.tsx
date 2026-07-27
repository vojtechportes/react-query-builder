import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { RecipeDemoOutput } from '../components/recipe-demo-output';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Paid', value: 'PAID' },
      { label: 'Pending', value: 'PENDING' },
    ],
  },
  {
    field: 'total',
    label: 'Total',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      { field: 'status', operator: 'EQUAL', value: 'PAID' },
      { field: 'total', operator: 'LARGER_EQUAL', value: 100 },
    ],
  },
];

export const ExportToPrismaWhereClauseDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const [wrapWhereClause, setWrapWhereClause] = React.useState(true);
  const output = React.useMemo(
    () => formatQuery(query, 'Prisma', { fields, wrapWhereClause }),
    [query, wrapWhereClause]
  );

  return (
    <RecipeDemoFrame
      title="Prisma where-clause export"
      note="This demo converts filters to Prisma syntax in your browser. Prisma Client and database access stay on the server."
      actions={
        <>
          <label>
            <input
              type="checkbox"
              checked={wrapWhereClause}
              onChange={(event) => setWrapWhereClause(event.target.checked)}
            />{' '}
            Include the Prisma where wrapper
          </label>
        </>
      }
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
        <RecipeDemoOutput label="Prisma filter preview" value={output} />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default ExportToPrismaWhereClauseDemo;
