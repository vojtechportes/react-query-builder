export const resolveRangeBoundValidation = <
  TValueValidation
>(
  validation:
    | Partial<{
        range?: {
          common?: Partial<TValueValidation>;
          start?: Partial<TValueValidation>;
          end?: Partial<TValueValidation>;
        };
      }>
    | undefined,
  boundary: 'start' | 'end'
): Partial<TValueValidation> => {
  const baseValidation = { ...(validation || {}) } as Record<string, unknown>;
  delete baseValidation.range;

  return {
    ...(baseValidation as Partial<TValueValidation>),
    ...(validation?.range?.common || {}),
    ...(validation?.range?.[boundary] || {}),
  };
};
