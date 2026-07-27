import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { isRecipeQuery } from '../utils/is-recipe-query.util';

interface IFilterForm {
  name: string;
  query: DenormalizedQuery;
}

const fields: IBuilderFieldProps[] = [
  {
    field: 'email',
    label: 'Email',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
  },
  {
    field: 'createdAt',
    label: 'Created',
    type: 'DATE',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'email', operator: 'CONTAINS', value: '@example.com' }],
  },
];
const defaultValues: IFilterForm = {
  name: 'Active customer search',
  query: initialQuery,
};

export const ReactHookFormQueryBuilderDemo: React.FC = () => {
  const [submitted, setSubmitted] = React.useState<IFilterForm | null>(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IFilterForm>({ defaultValues });

  const resetForm = () => {
    reset({ name: defaultValues.name, query: cloneRecipeQuery(initialQuery) });
    setSubmitted(null);
  };

  return (
    <RecipeDemoFrame
      title="React Hook Form query field"
      note="React Hook Form's Controller connects the Builder to validation, change tracking, submission, and reset."
    >
      <RecipeDemoGroup>
        <form onSubmit={handleSubmit(setSubmitted)}>
          <RecipeDemoGroup>
            <label htmlFor="recipe-filter-name">Filter name</label>
            <input
              id="recipe-filter-name"
              {...register('name', {
                required: 'A filter name is required.',
              })}
            />
            {errors.name ? <p role="alert">{errors.name.message}</p> : null}
          </RecipeDemoGroup>
          <RecipeDemoGroup>
            <Controller
              name="query"
              control={control}
              rules={{
                validate: (value) =>
                  isRecipeQuery(value, { maxDepth: 5, maxRules: 20 }) ||
                  'Fix the query structure before submitting.',
              }}
              render={({ field }) => (
                <RecipeBuilderSurface>
                  <Builder
                    fields={fields}
                    data={field.value}
                    onChange={field.onChange}
                    showValidation
                  />
                </RecipeBuilderSurface>
              )}
            />
            {errors.query ? <p role="alert">{errors.query.message}</p> : null}
          </RecipeDemoGroup>
          <RecipeDemoGroup>
            <p role="status">
              {isDirty ? 'You have unsaved changes.' : 'No unsaved changes.'}
            </p>
          </RecipeDemoGroup>
          <RecipeDemoGroup direction="row">
            <button type="submit" disabled={!isDirty}>
              Submit filter
            </button>
            <button type="button" onClick={resetForm}>
              Reset
            </button>
          </RecipeDemoGroup>
        </form>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <p role="status">
          {submitted
            ? `Submitted "${submitted.name}" with ${submitted.query.length} root group.`
            : 'Change the form to enable submission.'}
        </p>
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default ReactHookFormQueryBuilderDemo;
