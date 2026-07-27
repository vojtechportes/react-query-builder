export const builderFieldComparisonSnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'ORDER_TOTAL',
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: 'ORDER_APPROVAL_LIMIT',
      },
    ],
  },
];

<Builder
  allowFieldComparisons
  fields={fields}
  data={data}
  onChange={setData}
/>;`;
