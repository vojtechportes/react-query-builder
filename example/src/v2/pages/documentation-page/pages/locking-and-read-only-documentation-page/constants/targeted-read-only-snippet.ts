export const targetedReadOnlySnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    readOnly: {
      enabled: true,
      targets: ['combinator'],
    },
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        field: 'ORDER_TOTAL',
        operator: 'BETWEEN',
        value: [1000, 5000],
        readOnly: {
          enabled: true,
          targets: ['value'],
        },
      },
    ],
  },
];`;
