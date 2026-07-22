import { strings } from '../../../locales/en-us';
import { IBuilderFieldProps } from '../../types';
import { createUsageLimitExceededDiagnostic } from './create-usage-limit-exceeded-diagnostic.util';

describe('createUsageLimitExceededDiagnostic', () => {
  it('creates a usage-limit diagnostic', () => {
    const field: IBuilderFieldProps = {
      field: 'STATUS',
      label: 'Status',
      type: 'TEXT',
      usageLimit: { max: 1 },
    };

    expect(createUsageLimitExceededDiagnostic(field, 1, 7, strings)).toEqual({
      code: 'usage_limit_exceeded',
      message: 'Field "Status" can appear at most 1 times in this scope',
      start: 1,
      end: 7,
    });
  });
});
