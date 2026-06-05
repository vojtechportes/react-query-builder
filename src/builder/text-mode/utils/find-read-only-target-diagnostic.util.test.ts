import { DenormalizedQuery } from '../../../utils/query-tree';
import { findReadOnlyTargetDiagnostic } from './find-read-only-target-diagnostic.util';

describe('findReadOnlyTargetDiagnostic', () => {
  it('allows adding another rule with the same locked field and operator in a demo-like query', () => {
    const previousQuery: DenormalizedQuery = [
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
            ],
          },
        ],
      },
    ];

    const nextQuery: DenormalizedQuery = [
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
            field: 'CUSTOMER_CITY',
            operator: 'EQUAL',
            value: 'Brno',
          },
          {
            field: 'CUSTOMER_COUNTRY',
            operator: 'EQUAL',
            value: 'SK',
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
            ],
          },
        ],
      },
    ];

    expect(findReadOnlyTargetDiagnostic(previousQuery, nextQuery)).toBeNull();
  });

  it('keeps a targeted lock attached to the original exact duplicate when the duplicate is inserted before it', () => {
    const previousQuery: DenormalizedQuery = [
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
            field: 'ORDER_TOTAL',
            operator: 'EQUAL',
            value: 5,
          },
        ],
      },
    ];

    const nextQuery: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'CUSTOMER_COUNTRY',
            operator: 'EQUAL',
            value: 'SK',
          },
          {
            field: 'CUSTOMER_COUNTRY',
            operator: 'EQUAL',
            value: 'CZ',
          },
          {
            field: 'ORDER_TOTAL',
            operator: 'EQUAL',
            value: 5,
          },
        ],
      },
    ];

    expect(findReadOnlyTargetDiagnostic(previousQuery, nextQuery)).toBeNull();
  });
});
