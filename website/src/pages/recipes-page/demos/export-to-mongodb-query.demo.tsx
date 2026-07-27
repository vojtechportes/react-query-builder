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
    field: 'category',
    label: 'Category',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  {
    field: 'price',
    label: 'Price',
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
      { field: 'category', operator: 'EQUAL', value: 'books' },
      { field: 'price', operator: 'LARGER_EQUAL', value: 20 },
    ],
  },
];

export const ExportToMongodbQueryDemo: React.FC = () => {
  const [query, setQuery] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const output = React.useMemo(
    () => formatQuery(query, 'Mongo', { fields }),
    [query]
  );

  return (
    <RecipeDemoFrame
      title="MongoDB query export"
      note="This demo converts filters to MongoDB syntax in your browser. It does not connect to a database."
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
        <RecipeDemoOutput label="MongoDB syntax" value={output} />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default ExportToMongodbQueryDemo;
