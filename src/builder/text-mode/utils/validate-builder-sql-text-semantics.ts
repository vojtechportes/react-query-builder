import { IStrings } from '../../../constants/strings';
import { getValidationString } from '../../../utils/validation/get-validation-string.util';
import { IBuilderFieldProps } from '../../types';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';
import { ParsedNode } from '../../../query-formats/sql/sql-token.types';
import { collectParsedSqlRules } from '../../../query-formats/sql/utils/collect-parsed-sql-rules';
import { resolveFieldAllowedValues } from './resolve-field-allowed-values';

const createFieldNotFoundDiagnostic = (
  fieldName: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'field_not_found',
  message: getValidationString(
    strings.validation,
    'fieldNotFound',
    `Field "${fieldName}" is not defined`,
    { field: fieldName }
  ),
  start,
  end,
});

const createOneOfDiagnostic = (
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'one_of',
  message: getValidationString(
    strings.validation,
    'oneOf',
    'Value must be one of the allowed options'
  ),
  start,
  end,
});

const createOperatorNotAllowedDiagnostic = (
  fieldName: string,
  operator: string,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'operator_not_allowed',
  message: getValidationString(
    strings.validation,
    'operatorNotAllowed',
    `Operator "${operator}" is not allowed for field "${fieldName}"`,
    { field: fieldName, operator }
  ),
  start,
  end,
});

export const validateBuilderSqlTextSemantics = (
  nodes: ParsedNode[],
  fields: IBuilderFieldProps[],
  strings: IStrings
): ITextModeDiagnostic[] => {
  const diagnostics: ITextModeDiagnostic[] = [];
  const parsedRules = collectParsedSqlRules(nodes);

  parsedRules.forEach((rule) => {
    const field = fields.find((fieldItem) => fieldItem.field === rule.field);
    const operator = rule.operator;

    if (!field) {
      diagnostics.push(
        createFieldNotFoundDiagnostic(
          rule.field,
          rule.source.field.start,
          rule.source.field.end,
          strings
        )
      );
      return;
    }

    if (
      operator &&
      field.operators &&
      field.operators.length > 0 &&
      !field.operators.includes(operator) &&
      rule.source.operator
    ) {
      diagnostics.push(
        createOperatorNotAllowedDiagnostic(
          rule.field,
          operator,
          rule.source.operator.start,
          rule.source.operator.end,
          strings
        )
      );
      return;
    }

    if (field.type !== 'LIST' && field.type !== 'MULTI_LIST') {
      return;
    }

    const allowedValues = resolveFieldAllowedValues(field, operator);

    if (allowedValues.length === 0) {
      return;
    }

    if (Array.isArray(rule.value)) {
      rule.value.forEach((value, index) => {
        if (allowedValues.includes(value)) {
          return;
        }

        const range = rule.source.values?.[index] || rule.source.value;

        if (!range) {
          return;
        }

        diagnostics.push(
          createOneOfDiagnostic(range.start, range.end, strings)
        );
      });

      return;
    }

    if (
      typeof rule.value !== 'undefined' &&
      typeof rule.value !== 'boolean' &&
      !allowedValues.includes(rule.value) &&
      rule.source.value
    ) {
      diagnostics.push(
        createOneOfDiagnostic(
          rule.source.value.start,
          rule.source.value.end,
          strings
        )
      );
    }
  });

  return diagnostics;
};
