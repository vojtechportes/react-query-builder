import { IStrings } from '../../../constants/strings';
import { ParsedNode } from '../../../query-formats/sql/sql-token.types';
import { getBuilderValidationMessage } from '../../../utils/validation/get-builder-validation-message.util';
import { getValidationString } from '../../../utils/validation/get-validation-string.util';
import { IBuilderFieldProps } from '../../types';
import {
  resolveBuilderFieldUsageLimitKey,
  resolveBuilderFieldUsageLimitScope,
} from '../../utils/resolve-builder-field-usage.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';
import { resolveFieldAllowedValues } from './resolve-field-allowed-values';

interface IParsedRuleEntry {
  parentScopeId: string;
  rule: Exclude<ParsedNode, { kind: 'group' }>;
}

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

const createUsageLimitExceededDiagnostic = (
  field: IBuilderFieldProps,
  start: number,
  end: number,
  strings: IStrings
): ITextModeDiagnostic => ({
  code: 'usage_limit_exceeded',
  message: getBuilderValidationMessage(
    field.usageLimit?.message,
    getValidationString(
      strings.validation,
      'usageLimitExceeded',
      `Field "${field.field}" can appear at most ${field.usageLimit?.max} times in this scope`,
      {
        field: field.label || field.field,
        max: field.usageLimit?.max,
      }
    ),
    {
      field,
      usageLimit: field.usageLimit,
    }
  ),
  start,
  end,
});

const collectParsedRuleEntries = (
  nodes: ParsedNode[],
  parentScopeId = '__root__'
): IParsedRuleEntry[] =>
  nodes.flatMap((node, index) => {
    if ('kind' in node) {
      return collectParsedRuleEntries(node.children, `${parentScopeId}.${index}`);
    }

    return [{ rule: node, parentScopeId }];
  });

export const validateBuilderSqlTextSemantics = (
  nodes: ParsedNode[],
  fields: IBuilderFieldProps[],
  strings: IStrings
): ITextModeDiagnostic[] => {
  const diagnostics: ITextModeDiagnostic[] = [];
  const parsedRules = collectParsedRuleEntries(nodes);
  const usageCounts = new Map<string, number>();

  parsedRules.forEach(({ rule, parentScopeId }) => {
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

    if (field.usageLimit) {
      const scope = resolveBuilderFieldUsageLimitScope(field);
      const usageBucketKey = `${scope}:${resolveBuilderFieldUsageLimitKey(field)}:${
        scope === 'parent' ? parentScopeId : 'all'
      }`;
      const nextUsageCount = (usageCounts.get(usageBucketKey) || 0) + 1;

      usageCounts.set(usageBucketKey, nextUsageCount);

      if (nextUsageCount > field.usageLimit.max) {
        diagnostics.push(
          createUsageLimitExceededDiagnostic(
            field,
            rule.source.field.start,
            rule.source.field.end,
            strings
          )
        );
      }
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

        diagnostics.push(createOneOfDiagnostic(range.start, range.end, strings));
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
