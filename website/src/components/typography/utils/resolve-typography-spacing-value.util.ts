export const resolveTypographySpacingValue = (
  value?: string | number
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value === 0 ? '0' : `${value}rem`;
  }

  return value;
};
