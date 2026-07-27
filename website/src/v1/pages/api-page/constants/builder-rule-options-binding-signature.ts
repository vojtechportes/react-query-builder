export const builderRuleOptionsBindingSignature = `export interface IBuilderRuleOptionsResolverContext {
  ruleId: string;
  field: string;
  dependencies: Record<string, INearestFieldMatch | undefined>;
  signal: AbortSignal;
}

export interface IBuilderRuleOptionsBindingConfig {
  dependencies: string[];
  resolve: (
    context: IBuilderRuleOptionsResolverContext
  ) => Promise<BuilderFieldOption[]>;
  onError?: (
    error: unknown,
    context: Omit<IBuilderRuleOptionsResolverContext, 'signal'>
  ) => void;
  onOptionsResolved?: (
    context: {
      ruleId: string;
      field: string;
      dependencies: Record<string, INearestFieldMatch | undefined>;
      options: BuilderFieldOption[];
    }
  ) => void;
  clearOnMissingDependencies?: boolean;
}`;
