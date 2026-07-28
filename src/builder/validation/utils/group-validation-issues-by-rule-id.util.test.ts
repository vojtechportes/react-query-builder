import { IBuilderValidationIssue } from '../..';
import { groupValidationIssuesByRuleId } from './group-validation-issues-by-rule-id.util';

const issues: IBuilderValidationIssue[] = [
  { ruleId: 'rule-1', field: 'NAME', code: 'first', message: 'First' },
  { ruleId: 'rule-2', field: 'AGE', code: 'other', message: 'Other' },
  { ruleId: 'rule-1', field: 'NAME', code: 'second', message: 'Second' },
];

describe('groupValidationIssuesByRuleId', () => {
  it('groups issues by rule while preserving their order', () => {
    expect(groupValidationIssuesByRuleId(issues)).toEqual({
      'rule-1': [issues[0], issues[2]],
      'rule-2': [issues[1]],
    });
  });
});
