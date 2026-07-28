import { IBuilderFieldProps } from '../..';
import { validateFieldComparison } from './validate-field-comparison.util';

const textField: IBuilderFieldProps = {
  field: 'TEXT_A',
  label: 'Text A',
  type: 'TEXT',
  fieldComparison: {
    comparableFields: ['TEXT_B'],
  },
};
const compatibleTextField: IBuilderFieldProps = {
  field: 'TEXT_B',
  label: 'Text B',
  type: 'TEXT',
};
const incompatibleNumberField: IBuilderFieldProps = {
  field: 'NUMBER_A',
  label: 'Number A',
  type: 'NUMBER',
};
const fields = [textField, compatibleTextField, incompatibleNumberField];

describe('validateFieldComparison', () => {
  it.each([
    {
      expectedCode: 'field_comparison_disabled',
      overrides: { allowFieldComparisons: false },
    },
    {
      expectedCode: 'field_comparison_operator_not_allowed',
      overrides: { operator: 'BETWEEN' as const },
    },
    {
      expectedCode: 'value_field_required',
      overrides: { valueField: undefined },
    },
    {
      expectedCode: 'value_field_not_found',
      overrides: { valueField: 'MISSING' },
    },
    {
      expectedCode: 'field_comparison_incompatible',
      overrides: { valueField: 'NUMBER_A' },
    },
  ])(
    'returns $expectedCode for invalid comparisons',
    ({ expectedCode, overrides }) => {
      expect(
        validateFieldComparison({
          allowFieldComparisons: true,
          field: textField,
          fields,
          operator: 'EQUAL',
          valueField: 'TEXT_B',
          ...overrides,
        })
      ).toEqual(expect.objectContaining({ code: expectedCode }));
    }
  );

  it('accepts compatible fields for supported operators', () => {
    expect(
      validateFieldComparison({
        allowFieldComparisons: true,
        field: textField,
        fields,
        operator: 'EQUAL',
        valueField: 'TEXT_B',
      })
    ).toBeNull();
  });
});
