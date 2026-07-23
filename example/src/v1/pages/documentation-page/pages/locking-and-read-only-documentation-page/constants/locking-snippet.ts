export const lockingSnippet = `const data: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'STATUS',
        operator: 'EQUAL',
        value: 'ACTIVE',
        readOnly: {
          enabled: true,
          targets: ['field', 'operator'],
        },
      },
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        readOnly: {
          enabled: true,
          targets: ['combinator'],
        },
        children: [
          {
            field: 'COUNTRY',
            operator: 'EQUAL',
            value: 'CZ',
          },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        readOnly: {
          enabled: true,
          inheritToChildren: true,
        },
        children: [
          {
            field: 'IS_VAT_PAYER',
            operator: 'EQUAL',
            value: true,
          },
        ],
      },
    ],
  },
];

<Builder fields={fields} data={data} onChange={setData} />;`;
