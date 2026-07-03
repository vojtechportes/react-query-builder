import { strings } from '../../../constants/strings';
import { tryParseSql } from '../../../query-formats/sql/try-parse-sql';
import { IBuilderFieldProps } from '../../types';
import { validateBuilderSqlTextSemantics } from './validate-builder-sql-text-semantics';

const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'IS_NOT_NULL', 'LIKE', 'NOT_IN'],
    fieldComparison: { type: 'string', comparableFields: ['OTHER_TEXT_FIELD', 'LIST_FIELD'] },
  },
  {
    field: 'OTHER_TEXT_FIELD',
    label: 'Other Text Field',
    type: 'TEXT',
    operators: ['EQUAL'],
    fieldComparison: { type: 'string' },
  },
  {
    field: 'THIRD_TEXT_FIELD',
    label: 'Third Text Field',
    type: 'TEXT',
    operators: ['EQUAL'],
    fieldComparison: { type: 'string' },
  },
  {
    field: 'NUMBER_FIELD',
    label: 'Number Field',
    type: 'NUMBER',
    operators: ['EQUAL'],
  },
  {
    field: 'LIST_FIELD',
    label: 'List Field',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [{ value: 'alpha', label: 'Alpha' }],
    fieldComparison: { type: 'string' },
  },
];

const parseNodes = (value: string) => {
  const result = tryParseSql(value, strings.textMode);

  expect(result.diagnostics).toEqual([]);
  expect(result.parsedNodes).toBeDefined();

  return result.parsedNodes || [];
};

describe('validateBuilderSqlTextSemantics', () => {
  it('reports the NOT token range when group negation is disabled', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes("NOT (MOCK_FIELD = 'alpha')"),
      fields,
      strings,
      {
        allowGroupNegation: false,
      }
    );

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'negation_not_allowed',
        start: 0,
        end: 3,
      })
    );
  });

  it('rejects repeated NOT tokens when group negation is disabled', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes("NOT NOT (MOCK_FIELD = 'alpha')"),
      fields,
      strings,
      {
        allowGroupNegation: false,
      }
    );

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'negation_not_allowed',
        start: 0,
        end: 3,
      })
    );
  });

  it('allows operator-level NOT expressions when group negation is disabled', () => {
    const isNotNullDiagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD IS NOT NULL'),
      fields,
      strings,
      {
        allowGroupNegation: false,
      }
    );
    const notInDiagnostics = validateBuilderSqlTextSemantics(
      parseNodes("MOCK_FIELD NOT IN ('alpha', 'beta')"),
      fields,
      strings,
      {
        allowGroupNegation: false,
      }
    );

    expect(isNotNullDiagnostics).toEqual([]);
    expect(notInDiagnostics).toEqual([]);
  });

  it('allows supported field-to-field comparisons when enabled', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = OTHER_TEXT_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: true }
    );

    expect(diagnostics).toEqual([]);
  });

  it('rejects field comparisons when the Builder flag is disabled', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = OTHER_TEXT_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: false }
    );

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'field_comparison_disabled',
      })
    );
  });

  it('reports missing comparison fields', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = UNKNOWN_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: true }
    );

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'value_field_not_found',
      })
    );
  });

  it('reports incompatible comparison fields', () => {
    const typeMismatchDiagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = NUMBER_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: true }
    );
    const selfComparisonDiagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = MOCK_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: true }
    );

    expect(typeMismatchDiagnostics).toContainEqual(
      expect.objectContaining({
        code: 'field_comparison_incompatible',
      })
    );
    expect(selfComparisonDiagnostics).toContainEqual(
      expect.objectContaining({
        code: 'field_comparison_incompatible',
      })
    );
  });

  it('reports allowlist-incompatible comparison fields', () => {
    const diagnostics = validateBuilderSqlTextSemantics(
      parseNodes('MOCK_FIELD = THIRD_TEXT_FIELD'),
      fields,
      strings,
      { allowFieldComparisons: true }
    );

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'field_comparison_incompatible',
      })
    );
  });
});


