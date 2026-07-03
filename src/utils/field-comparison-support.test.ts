import {
  BuilderFieldComparisonType,
  IBuilderFieldComparisonConfig,
  IBuilderFieldProps,
} from '../builder';
import {
  areFieldsCompatibleForComparison,
  getCompatibleValueFields,
  resolveFieldComparisonType,
  supportsFieldComparisonForOperator,
} from './field-comparison-support';

describe('field comparison support', () => {
  const explicitConfig: IBuilderFieldComparisonConfig = {
    type: 'string',
    comparableFields: ['TEXT_B', 'LIST_STRING'],
  };
  const explicitType: BuilderFieldComparisonType = 'string';
  void explicitType;

  const fields: IBuilderFieldProps[] = [
    {
      field: 'TEXT_A',
      label: 'Text A',
      type: 'TEXT',
      fieldComparison: explicitConfig,
    },
    { field: 'TEXT_B', label: 'Text B', type: 'TEXT' },
    { field: 'NUMBER_A', label: 'Number A', type: 'NUMBER' },
    {
      field: 'LIST_STRING',
      label: 'List String',
      type: 'LIST',
      value: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    },
    {
      field: 'LIST_NUMBER',
      label: 'List Number',
      type: 'LIST',
      value: [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
      ],
    },
    {
      field: 'LIST_MIXED',
      label: 'List Mixed',
      type: 'LIST',
      value: [
        { value: 'a', label: 'A' },
        { value: 1, label: 'One' },
      ],
    },
    {
      field: 'LIST_EXPLICIT_NUMBER',
      label: 'List Explicit Number',
      type: 'LIST',
      value: [{ value: '1', label: 'One' }],
      fieldComparison: {
        type: 'number',
      },
    },
    { field: 'MULTI_A', label: 'Multi A', type: 'MULTI_LIST' },
  ];

  it('resolves implicit and explicit field comparison types', () => {
    expect(resolveFieldComparisonType(fields[0])).toBe('string');
    expect(resolveFieldComparisonType(fields[2])).toBe('number');
    expect(resolveFieldComparisonType(fields[3])).toBe('string');
    expect(resolveFieldComparisonType(fields[4])).toBe('number');
    expect(resolveFieldComparisonType(fields[5])).toBeUndefined();
    expect(resolveFieldComparisonType(fields[6])).toBe('number');
    expect(resolveFieldComparisonType(fields[7])).toBeUndefined();
  });

  it('supports scalar and configured single-value field comparisons', () => {
    expect(supportsFieldComparisonForOperator(fields[0], 'EQUAL')).toBe(true);
    expect(supportsFieldComparisonForOperator(fields[2], 'LARGER')).toBe(true);
    expect(supportsFieldComparisonForOperator(fields[3], 'EQUAL')).toBe(true);
    expect(supportsFieldComparisonForOperator(fields[6], 'LARGER_EQUAL')).toBe(true);
  });

  it('rejects unsupported operators and fields without semantic comparison types', () => {
    expect(supportsFieldComparisonForOperator(fields[0], 'BETWEEN')).toBe(false);
    expect(supportsFieldComparisonForOperator(fields[0], 'IN')).toBe(false);
    expect(supportsFieldComparisonForOperator(fields[0], 'IS_NULL')).toBe(false);
    expect(supportsFieldComparisonForOperator(fields[5], 'EQUAL')).toBe(false);
    expect(supportsFieldComparisonForOperator(fields[7], 'EQUAL')).toBe(false);
  });

  it('matches fields by semantic comparison type instead of raw builder type', () => {
    expect(areFieldsCompatibleForComparison(fields[0], fields[1])).toBe(true);
    expect(areFieldsCompatibleForComparison(fields[0], fields[3])).toBe(true);
    expect(areFieldsCompatibleForComparison(fields[0], fields[2])).toBe(false);
    expect(areFieldsCompatibleForComparison(fields[3], fields[1])).toBe(true);
    expect(areFieldsCompatibleForComparison(fields[4], fields[2])).toBe(true);
  });

  it('applies the source-owned comparableFields allowlist', () => {
    expect(areFieldsCompatibleForComparison(fields[0], fields[1])).toBe(true);
    expect(areFieldsCompatibleForComparison(fields[0], fields[3])).toBe(true);
    expect(areFieldsCompatibleForComparison(fields[0], fields[4])).toBe(false);
  });

  it('returns only semantically compatible candidate fields other than the source field', () => {
    expect(getCompatibleValueFields(fields, fields[0], 'EQUAL')).toEqual([
      fields[1],
      fields[3],
    ]);
    expect(getCompatibleValueFields(fields, fields[4], 'EQUAL')).toEqual([
      fields[2],
      fields[6],
    ]);
  });

  it('returns no compatible candidates for operators that cannot compare fields', () => {
    expect(getCompatibleValueFields(fields, fields[0], 'BETWEEN')).toEqual([]);
    expect(getCompatibleValueFields(fields, fields[0], 'IS_NULL')).toEqual([]);
  });

  it('accepts the new field-comparison config shape on field definitions', () => {
    expect(fields[0].fieldComparison).toEqual(explicitConfig);
  });
});
