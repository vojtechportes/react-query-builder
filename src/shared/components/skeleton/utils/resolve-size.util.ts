export const resolveSize = (value?: string | number): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value === 0 ? '0' : `${value}px`;
  }

  return value;
};
