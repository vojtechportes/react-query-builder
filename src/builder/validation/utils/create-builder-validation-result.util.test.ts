import { IBuilderValidationIssue } from '../..';
import { createBuilderValidationResult } from './create-builder-validation-result.util';

const issues: IBuilderValidationIssue[] = [
  { ruleId: 'rule-1', field: 'NAME', message: 'Invalid name' },
  { ruleId: 'rule-2', field: 'AGE', message: 'Invalid age' },
];

describe('createBuilderValidationResult', () => {
  it('creates valid and invalid result shapes', () => {
    expect(createBuilderValidationResult([])).toEqual({
      isValid: true,
      issues: [],
      issuesByRuleId: {},
    });
    expect(createBuilderValidationResult(issues)).toEqual({
      isValid: false,
      issues,
      issuesByRuleId: {
        'rule-1': [issues[0]],
        'rule-2': [issues[1]],
      },
    });
  });
});
