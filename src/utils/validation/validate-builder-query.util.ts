import {
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationResult,
} from '../../builder';
import { isDenormalizedGroupNode } from '../is-denormalized-group-node.util';
import { isPromiseLike } from '../is-promise-like.util';
import { DenormalizedQuery, IDenormalizedRuleNode } from '../query-tree';
import { createBuilderValidationResult } from './create-builder-validation-result.util';
import { getValidationString } from './get-validation-string.util';
import { validateBuilderRule } from './validate-builder-rule.util';

const collectRules = (data: DenormalizedQuery): IDenormalizedRuleNode[] => {
  return data.flatMap((item) => {
    if (isDenormalizedGroupNode(item)) {
      return collectRules(item.children);
    }

    return [item];
  });
};

export const validateBuilderQuery = (
  data: DenormalizedQuery,
  context: IBuilderValidationContext
): Promise<IBuilderValidationResult> | IBuilderValidationResult => {
  const rules = collectRules(data);
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];

  for (const rule of rules) {
    if (typeof rule.field !== 'string' || rule.field.trim() === '') {
      continue;
    }

    const field = context.fields.find((fieldItem) => fieldItem.field === rule.field);

    if (!field) {
      if (rule.id) {
        issues.push({
          ruleId: rule.id,
          field: rule.field,
          code: 'field_not_found',
          message: getValidationString(
            context.strings.validation,
            'fieldNotFound',
            `Field "${rule.field}" is not defined`,
            { field: rule.field }
          ),
        });
      }

      continue;
    }

    const ruleIssues = validateBuilderRule(rule, field, context);

    if (isPromiseLike(ruleIssues)) {
      pendingIssueGroups.push(ruleIssues);
    } else {
      issues.push(...ruleIssues);
    }
  }

  if (pendingIssueGroups.length > 0) {
    return Promise.all(pendingIssueGroups).then((asyncIssueGroups) =>
      createBuilderValidationResult([...issues, ...asyncIssueGroups.flat()])
    );
  }

  return createBuilderValidationResult(issues);
};
