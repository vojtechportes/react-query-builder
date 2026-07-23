export const builderRefBasicSnippet = `import React, { useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'STATUS',
    label: 'Status',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL'],
    value: [
      { value: 'ACTIVE', label: 'Active' },
      { value: 'ARCHIVED', label: 'Archived' },
    ],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATUS',
        operator: 'EQUAL',
        value: 'ACTIVE',
      },
    ],
  },
];

export const BuilderRefExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const rootGroupId = builderRef.current
            ?.getNodes()
            .find(node => 'type' in node)?.id;

          if (!rootGroupId) {
            return;
          }

          builderRef.current?.addRule(
            {
              field: 'STATUS',
              operator: 'NOT_EQUAL',
              value: 'ARCHIVED',
            },
            rootGroupId
          );
        }}
      >
        Add rule
      </button>
      <Builder ref={builderRef} fields={fields} data={data} onChange={setData} />
    </>
  );
};`;
