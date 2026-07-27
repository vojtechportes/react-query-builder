export const fieldsFieldComparisonSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
    fieldComparison: {
      type: 'string',
      comparableFields: ['DELIVERY_COUNTRY_CODE'],
    },
  },
  {
    field: 'DELIVERY_COUNTRY_CODE',
    label: 'Delivery country code',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
];`;
