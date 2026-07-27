import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

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

export const HookFormFilter = () => {
  const { control, handleSubmit, reset, formState } = useForm<IFilterForm>({
    defaultValues: { name: 'Customer search', query: initialQuery },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="query"
        control={control}
        rules={{ validate: (value) => value.length > 0 || 'Add a query root.' }}
        render={({ field }) => (
          <Builder
            fields={fields}
            data={field.value}
            onChange={field.onChange}
            showValidation
          />
        )}
      />
      <button type="submit" disabled={!formState.isDirty}>
        Save
      </button>
      <button type="button" onClick={() => reset()}>
        Reset
      </button>
    </form>
  );
};
