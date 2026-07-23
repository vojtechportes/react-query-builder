import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const initialQueryTree: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'CUSTOMER_COUNTRY',
        operator: 'EQUAL',
        value: 'CZ',
        readOnly: {
          enabled: true,
          targets: ['operator', 'field'],
        },
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
          {
            field: 'CUSTOMER_COUNTRY',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'CUSTOMER_COUNTRY_CODE',
          },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'CUSTOMER_CITY',
            operator: 'EQUAL',
            value: 'Prague',
            readOnly: true,
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'BETWEEN',
            value: [2500, 12000],
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'SMALLER_EQUAL',
            valueSource: 'field',
            valueField: 'ORDER_APPROVAL_LIMIT',
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'LARGER_EQUAL',
            valueSource: 'field',
            valueField: 'ORDER_MANUAL_REVIEW_THRESHOLD',
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
          {
            field: 'CUSTOMER_SEGMENTS',
            operator: 'ALL_IN',
            value: ['B2B', 'Priority'],
          },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              {
                field: 'COMPANY_NAME',
                operator: 'EQUAL',
                valueSource: 'field',
                valueField: 'CUSTOMER_CITY',
              },
              {
                field: 'ORDER_CREATED_AT',
                operator: 'LARGER_EQUAL',
                value: '2025-01-01',
              },
            ],
          },
        ],
      },
    ],
  },
];
