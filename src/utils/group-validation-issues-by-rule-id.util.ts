import { IBuilderValidationIssue } from '../builder';

export const groupValidationIssuesByRuleId = (
  issues: IBuilderValidationIssue[]
): Record<string, IBuilderValidationIssue[]> => {
  return issues.reduce<Record<string, IBuilderValidationIssue[]>>(
    (issuesByRuleId, issue) => {
      if (!issuesByRuleId[issue.ruleId]) {
        issuesByRuleId[issue.ruleId] = [];
      }

      issuesByRuleId[issue.ruleId].push(issue);

      return issuesByRuleId;
    },
    {}
  );
};
