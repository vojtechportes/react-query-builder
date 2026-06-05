import {
  IBuilderFieldProps,
  IBuilderValidationContext,
  IBuilderValidationIssue,
  IBuilderValidationResult,
} from '../../builder';
import { isDenormalizedGroupNode } from '../is-denormalized-group-node.util';
import { isPromiseLike } from '../is-promise-like.util';
import { DenormalizedQuery, IDenormalizedRuleNode } from '../query-tree';
import { createBuilderValidationResult } from './create-builder-validation-result.util';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';
import { getValidationString } from './get-validation-string.util';
import { validateBuilderRule } from './validate-builder-rule.util';

interface ICollectedRuleEntry {
  parentId?: string;
  rule: IDenormalizedRuleNode;
}

const collectRules = (
  data: DenormalizedQuery,
  parentId?: string
): ICollectedRuleEntry[] => {
  return data.flatMap((item) => {
    if (isDenormalizedGroupNode(item)) {
      return collectRules(item.children, item.id);
    }

    return [{ rule: item, parentId }];
  });
};

const resolveUsageLimitScope = (field: IBuilderFieldProps) =>
  field.usageLimit?.scope || 'global';

const resolveUsageLimitKey = (field: IBuilderFieldProps) =>
  field.usageLimit?.key || field.field;

export const validateBuilderQuery = (
  data: DenormalizedQuery,
  context: IBuilderValidationContext
): Promise<IBuilderValidationResult> | IBuilderValidationResult => {
  const rules = collectRules(data);
  const issues: IBuilderValidationIssue[] = [];
  const pendingIssueGroups: Array<Promise<IBuilderValidationIssue[]>> = [];
  const usageCounts = new Map<string, number>();

  for (const { rule, parentId } of rules) {
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

    if (field.usageLimit && rule.id) {
      const scope = resolveUsageLimitScope(field);
      const usageBucketKey = `${scope}:${resolveUsageLimitKey(field)}:${
        scope === 'parent' ? parentId || '__root__' : 'all'
      }`;
      const currentUsageCount = usageCounts.get(usageBucketKey) || 0;
      const nextUsageCount = currentUsageCount + 1;

      usageCounts.set(usageBucketKey, nextUsageCount);

      if (nextUsageCount > field.usageLimit.max) {
        issues.push({
          ruleId: rule.id,
          field: rule.field,
          code: 'usage_limit_exceeded',
          message: getBuilderValidationMessage(
            field.usageLimit.message,
            getValidationString(
              context.strings.validation,
              'usageLimitExceeded',
              `Field "${rule.field}" can appear at most ${field.usageLimit.max} times in this scope`,
              {
                field: field.label || rule.field,
                max: field.usageLimit.max,
              }
            ),
            {
              field,
              operator: rule.operator,
              ruleId: rule.id,
              usageLimit: field.usageLimit,
              value: rule.value,
            }
          ),
        });
      }
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
