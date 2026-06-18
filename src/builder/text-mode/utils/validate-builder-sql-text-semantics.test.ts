import { strings } from '../../../constants/strings';
import { tryParseSql } from '../../../query-formats/sql/try-parse-sql';
import { IBuilderFieldProps } from '../../types';
import { validateBuilderSqlTextSemantics } from './validate-builder-sql-text-semantics';

const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'IS_NOT_NULL', 'NOT_IN'],
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
});
