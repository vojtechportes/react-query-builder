export const fieldUsageLimitSignature = `export type BuilderFieldUsageLimitScope = 'global' | 'parent';

export interface IBuilderFieldUsageLimit {
  key?: string;
  max: number;
  scope?: BuilderFieldUsageLimitScope;
  message?: BuilderValidationMessage;
}`;
