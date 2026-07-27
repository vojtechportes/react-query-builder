import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { formatQuery } from '@vojtechportes/react-query-builder/formatQuery';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDataTable } from '../components/recipe-data-table';
import { CollapsibleSection } from '../../../components/collapsible-section';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { RecipeDemoOutput } from '../components/recipe-demo-output';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { doesRecipeRowMatch } from '../utils/does-recipe-row-match.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'category',
    label: 'Category',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { label: 'Books', value: 'BOOKS' },
      { label: 'Games', value: 'GAMES' },
      { label: 'Hardware', value: 'HARDWARE' },
    ],
  },
  {
    field: 'price',
    label: 'Price',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
  {
    field: 'inStock',
    label: 'In stock',
    type: 'BOOLEAN',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
];

const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      { field: 'inStock', operator: 'EQUAL', value: true },
      { field: 'price', operator: 'SMALLER_EQUAL', value: 50 },
    ],
  },
];

export const PrismaFilterUiDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const rows = React.useMemo(
    () => recipeDemoRows.filter((row) => doesRecipeRowMatch(row, query)),
    [query]
  );
  const prismaWhere = React.useMemo(
    () => formatQuery(query, 'Prisma', { fields, wrapWhereClause: true }),
    [query]
  );

  return (
    <RecipeDemoFrame
      title="Prisma product filter"
      kind="mock"
      note="Changing a rule immediately filters the sample products and updates the Prisma filter preview."
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
        <RecipeDataTable
          caption="Filtered products"
          columns={[
            { field: 'name', label: 'Product owner' },
            { field: 'category', label: 'Category' },
            { field: 'price', label: 'Price' },
            { field: 'inStock', label: 'In stock' },
          ]}
          rows={rows}
        />
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <CollapsibleSection
          collapsedLabel="Show generated Prisma where"
          expandedLabel="Hide generated Prisma where"
        >
          <RecipeDemoOutput
            label="Prisma filter preview"
            value={prismaWhere}
          />
        </CollapsibleSection>
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default PrismaFilterUiDemo;
