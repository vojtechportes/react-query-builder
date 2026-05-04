import {
  IBuilderFieldProps,
  IBuilderValidationContext,
} from '../builder';
import { strings } from '../constants/strings';
import { validateBuilderQuery } from './validation/validate-builder-query.util';

describe('validateBuilderQuery', () => {
  const context: IBuilderValidationContext = {
    fields: [
      {
        field: 'NAME',
        label: 'Name',
        type: 'TEXT',
        operators: ['EQUAL', 'IS_NULL'],
        validation: {
          required: true,
          minLength: 3,
        },
      },
      {
        field: 'AMOUNT',
        label: 'Amount',
        type: 'NUMBER',
        operators: ['LARGER', 'BETWEEN', 'NOT_BETWEEN'],
        validation: {
          common: {
            required: true,
          },
          rules: [
            {
              operators: ['LARGER'],
              min: 10,
              max: 20,
            },
            {
              operators: ['BETWEEN', 'NOT_BETWEEN'],
              range: {
                common: {
                  min: 10,
                  max: 20,
                },
                start: {
                  max: 15,
                },
                end: {
                  min: 12,
                },
                requireAscending: true,
                allowEqual: false,
              },
            },
          ],
        },
      },
    ] as IBuilderFieldProps[],
    singleRootGroup: true,
    groupTypes: 'with-modifiers',
    strings,
  };

  it('Returns required and min length issues for invalid text rules', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ id: 'rule-1', field: 'NAME', operator: 'EQUAL', value: '' }],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(false);
    expect(result.issuesByRuleId['rule-1']).toHaveLength(1);
    expect(result.issuesByRuleId['rule-1'][0].code).toEqual('required');
  });

  it('Returns no issue for IS_NULL without a value', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ id: 'rule-1', field: 'NAME', operator: 'IS_NULL' }],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(true);
    expect(result.issues).toHaveLength(0);
  });

  it('Returns no issue for placeholder rules without a selected field', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ id: 'rule-empty', field: '' }],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(true);
    expect(result.issuesByRuleId['rule-empty']).toBeUndefined();
  });

  it('Returns a range issue when numeric range order is invalid', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              id: 'rule-2',
              field: 'AMOUNT',
              operator: 'BETWEEN',
              value: [10, 5],
            },
          ],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(false);
    expect(result.issuesByRuleId['rule-2'].map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['range_order'])
    );
  });

  it('Applies operator-specific scalar validation for single-value operators', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              id: 'rule-3',
              field: 'AMOUNT',
              operator: 'LARGER',
              value: 5,
            },
          ],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(false);
    expect(result.issuesByRuleId['rule-3'][0].code).toEqual('min');
  });

  it('Applies common and boundary-specific validation for range operators', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              id: 'rule-4',
              field: 'AMOUNT',
              operator: 'BETWEEN',
              value: [16, 11],
            },
          ],
        },
      ],
      context
    );

    expect(result.isValid).toEqual(false);
    expect(result.issuesByRuleId['rule-4'].map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['max', 'min', 'range_order'])
    );
  });

  it('Uses localized validation messages from strings', async () => {
    const result = await validateBuilderQuery(
      [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ id: 'rule-1', field: 'NAME', operator: 'EQUAL', value: '' }],
        },
      ],
      {
        ...context,
        strings: {
          ...strings,
          validation: {
            ...strings.validation,
            required: 'This field is mandatory',
          },
        },
      }
    );

    expect(result.issuesByRuleId['rule-1'][0].message).toEqual(
      'This field is mandatory'
    );
  });
});
