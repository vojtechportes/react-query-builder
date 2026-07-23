import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const parsingSandboxInitialQueryTree: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
      },
      {
        type: 'GROUP',
        value: 'OR',
        isNegated: false,
        children: [
          {
            field: 'CUSTOMER_CITY',
            operator: 'EQUAL',
            value: 'Prague',
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'BETWEEN',
            value: [2500, 12000],
          },
        ],
      },
      {
        field: 'IS_VAT_PAYER',
        operator: 'EQUAL',
        value: true,
      },
      {
        field: 'CUSTOMER_SEGMENTS',
        operator: 'ALL_IN',
        value: ['B2B', 'Priority'],
      },
      {
        field: 'ORDER_CREATED_AT',
        operator: 'LARGER_EQUAL',
        value: '2025-01-01',
      },
    ],
  },
];
