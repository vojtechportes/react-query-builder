import {
  colors,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

export const demoFields: IBuilderFieldProps[] = [
  {
    field: 'CUSTOMER_COUNTRY',
    label: 'Customer country',
    type: 'LIST',
    operators: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'DE', label: 'Germany' },
      { value: 'AT', label: 'Austria' },
    ],
  },
  {
    field: 'CUSTOMER_SEGMENTS',
    label: 'Customer segments',
    type: 'MULTI_LIST',
    operators: ['ALL_IN', 'ANY_IN', 'IN', 'NOT_IN'],
    value: [
      { value: 'B2B', label: 'B2B' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Priority', label: 'Priority' },
      { value: 'Dormant', label: 'Dormant' },
    ],
  },
  {
    field: 'IS_IN_EU',
    label: 'Customer is in EU',
    type: 'BOOLEAN',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'IS_VAT_PAYER',
    label: 'Customer is VAT payer',
    type: 'BOOLEAN',
    operators: ['EQUAL', 'NOT_EQUAL', 'IS_NULL', 'IS_NOT_NULL'],
  },
  {
    field: 'CUSTOMER_CITY',
    label: 'Customer city',
    type: 'TEXT',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'CONTAINS',
      'NOT_CONTAINS',
      'STARTS_WITH',
      'ENDS_WITH',
      'LIKE',
      'NOT_LIKE',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'BETWEEN',
      'NOT_BETWEEN',
      'LARGER',
      'SMALLER',
      'LARGER_EQUAL',
      'SMALLER_EQUAL',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'ORDER_CREATED_AT',
    label: 'Order created at',
    type: 'DATE',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'BETWEEN',
      'NOT_BETWEEN',
      'LARGER',
      'SMALLER',
      'LARGER_EQUAL',
      'SMALLER_EQUAL',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
  },
  {
    field: 'COMPANY_NAME',
    label: 'Company name',
    type: 'TEXT',
    operators: [
      'EQUAL',
      'NOT_EQUAL',
      'CONTAINS',
      'NOT_CONTAINS',
      'STARTS_WITH',
      'ENDS_WITH',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
    validation: {
      required: true,
    },
  },
  {
    field: 'DELIVERY_WINDOW',
    label: 'Delivery window',
    type: 'TEXT',
    operators: ['BETWEEN', 'NOT_BETWEEN'],
  },
  {
    field: 'RISK_NOTE',
    label: 'Risk note',
    type: 'STATEMENT',
    value: 'HAS_DEBT() AND LAST_PAYMENT_DAYS_AGO() > 30',
  },
];

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
        readOnly: true,
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
                operator: 'CONTAINS',
                value: 'Prague',
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

export const defaultTheme = { colors };

