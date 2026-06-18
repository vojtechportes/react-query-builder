import { IStrings } from '../../../constants/strings';
import { ParsedNode } from '../../../query-formats/sql/sql-token.types';
import { IBuilderFieldProps } from '../../types';
import {
  resolveBuilderFieldUsageLimitKey,
  resolveBuilderFieldUsageLimitScope,
} from '../../utils/resolve-builder-field-usage.util';
import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';
import { collectParsedRuleEntries } from './collect-parsed-rule-entries.util';
import { createFieldNotFoundDiagnostic } from './create-field-not-found-diagnostic.util';
import { createNegationNotAllowedDiagnostic } from './create-negation-not-allowed-diagnostic.util';
import { createOneOfDiagnostic } from './create-one-of-diagnostic.util';
import { createOperatorNotAllowedDiagnostic } from './create-operator-not-allowed-diagnostic.util';
import { createUsageLimitExceededDiagnostic } from './create-usage-limit-exceeded-diagnostic.util';
import { findFirstGroupWithNegationToken } from './find-first-group-with-negation-token.util';
import { resolveFieldAllowedValues } from './resolve-field-allowed-values';

interface IValidateBuilderSqlTextSemanticsOptions {
  allowGroupNegation?: boolean;
}

export const validateBuilderSqlTextSemantics = (
  nodes: ParsedNode[],
  fields: IBuilderFieldProps[],
  strings: IStrings,
  options: IValidateBuilderSqlTextSemanticsOptions = {}
): ITextModeDiagnostic[] => {
  const diagnostics: ITextModeDiagnostic[] = [];
  const parsedRules = collectParsedRuleEntries(nodes);
  const usageCounts = new Map<string, number>();

  if (options.allowGroupNegation === false) {
    const negatedGroup = findFirstGroupWithNegationToken(nodes);
    const firstNegationSource = negatedGroup?.negationSources?.[0];

    if (firstNegationSource) {
      diagnostics.push(
        createNegationNotAllowedDiagnostic(
          firstNegationSource.start,
          firstNegationSource.end,
          strings
        )
      );
    }
  }

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
