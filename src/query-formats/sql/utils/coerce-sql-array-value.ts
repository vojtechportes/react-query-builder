export const coerceSqlArrayValue = (
  value: unknown
): Array<string | number> | null => {
  if (Array.isArray(value)) {
    return value as Array<string | number>;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return null;
};
