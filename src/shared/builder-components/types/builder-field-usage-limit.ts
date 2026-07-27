import type { BuilderFieldUsageLimitScope } from './builder-field-usage-limit-scope';
import type { BuilderValidationMessage } from './builder-validation-message';

export interface IBuilderFieldUsageLimit {
  key?: string;
  max: number;
  scope?: BuilderFieldUsageLimitScope;
  message?: BuilderValidationMessage;
}
