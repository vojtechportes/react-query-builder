import {
  IBuilderValidationIssue,
  IBuilderValidationResult,
} from '../builder';
import { groupValidationIssuesByRuleId } from './group-validation-issues-by-rule-id.util';

export const createBuilderValidationResult = (
  issues: IBuilderValidationIssue[]
): IBuilderValidationResult => {
  return {
    isValid: issues.length === 0,
    issues,
    issuesByRuleId: groupValidationIssuesByRuleId(issues),
  };
};
