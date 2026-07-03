import { strings } from '../../constants/strings';
import { validateBuilderRule } from './validate-builder-rule.util';

describe('validateBuilderRule field comparisons', () => {
  const validationContext: any = {
    fields: [
      {
        field: 'TEXT_A',
        label: 'Text A',
        type: 'TEXT',
        operators: ['EQUAL', 'BETWEEN', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'NOT_CONTAINS'],
        validation: { required: true },
        fieldComparison: { type: 'string', comparableFields: ['TEXT_B', 'LIST_A'] },
      },
      {
        field: 'TEXT_B',
        label: 'Text B',
        type: 'TEXT',
        operators: ['EQUAL'],
        fieldComparison: { type: 'string' },
      },
      {
        field: 'TEXT_C',
        label: 'Text C',
        type: 'TEXT',
        operators: ['EQUAL'],
        fieldComparison: { type: 'string' },
      },
      {
        field: 'LIST_A',
        label: 'List A',
        type: 'LIST',
        operators: ['EQUAL'],
        value: [{ value: 'a', label: 'A' }],
        fieldComparison: { type: 'string' },
      },
    ],
    singleRootGroup: true,
    groupTypes: 'with-modifiers',
    allowGroupNegation: true,
    allowFieldComparisons: true,
    strings,
  };

  it('does not report required-value errors for valid field comparisons', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-1',
          field: 'TEXT_A',
          operator: 'EQUAL',
          valueSource: 'field',
          valueField: 'TEXT_B',
        },
        validationContext.fields[0],
        validationContext
      )
    ).toEqual([]);
  });

  it('accepts supported string-method field comparisons', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-string-method',
          field: 'TEXT_A',
          operator: 'CONTAINS',
          valueSource: 'field',
          valueField: 'TEXT_B',
        },
        validationContext.fields[0],
        validationContext
      )
    ).toEqual([]);
  });

  it('rejects field comparisons when the Builder flag is disabled', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-flag-off',
          field: 'TEXT_A',
          operator: 'EQUAL',
          valueSource: 'field',
          valueField: 'TEXT_B',
        },
        validationContext.fields[0],
        {
          ...validationContext,
          allowFieldComparisons: false,
        }
      )
    ).toEqual([
      expect.objectContaining({
        code: 'field_comparison_disabled',
      }),
    ]);
  });

  it('rejects operators that do not support field comparisons', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-operator',
          field: 'TEXT_A',
          operator: 'BETWEEN',
          valueSource: 'field',
          valueField: 'TEXT_B',
        },
        validationContext.fields[0],
        validationContext
      )
    ).toEqual([
      expect.objectContaining({
        code: 'field_comparison_operator_not_allowed',
      }),
    ]);
  });

  it('rejects incompatible comparison fields', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-2',
          field: 'TEXT_A',
          operator: 'EQUAL',
          valueSource: 'field',
          valueField: 'TEXT_A',
        },
        validationContext.fields[0],
        validationContext
      )
    ).toEqual([
      expect.objectContaining({
        code: 'field_comparison_incompatible',
      }),
    ]);
  });

  it('rejects comparison fields outside the source allowlist', () => {
    expect(
      validateBuilderRule(
        {
          id: 'rule-allowlist',
          field: 'TEXT_A',
          operator: 'EQUAL',
          valueSource: 'field',
          valueField: 'TEXT_C',
        },
        validationContext.fields[0],
        validationContext
      )
    ).toEqual([
      expect.objectContaining({
        code: 'field_comparison_incompatible',
      }),
    ]);
  });
});
