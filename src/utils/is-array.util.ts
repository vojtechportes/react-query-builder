export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};
