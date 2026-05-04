import {
  IBuilderFieldProps,
  IBuilderValidationContext,
} from '../builder';
import { strings } from '../constants/strings';
import { validateBuilderQuery } from './validate-builder-query.util';

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
        operators: ['BETWEEN'],
        validation: {
          required: true,
          range: {
            requireAscending: true,
            allowEqual: false,
          },
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
    expect(result.issuesByRuleId['rule-2'][0].code).toEqual('range_order');
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
