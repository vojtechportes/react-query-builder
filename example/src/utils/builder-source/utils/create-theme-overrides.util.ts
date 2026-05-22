import type { IColors } from '../../../../src/constants/colors';

export const createThemeOverrides = (
  themeColors: IColors,
  defaultThemeColors: IColors
): Partial<IColors> | null => {
  const overrides: Partial<IColors> = {};

  for (const colorGroupKey of Object.keys(themeColors) as Array<keyof IColors>) {
    const nextValue = themeColors[colorGroupKey];
    const defaultValue = defaultThemeColors[colorGroupKey];

    if (
      typeof nextValue === 'string' ||
      typeof defaultValue === 'string'
    ) {
      if (nextValue !== defaultValue) {
        overrides[colorGroupKey] = nextValue;
      }

      continue;
    }

    const nestedOverrides = Object.fromEntries(
      Object.entries(nextValue).filter(([key, value]) => value !== defaultValue[key])
    );

    if (Object.keys(nestedOverrides).length > 0) {
      overrides[colorGroupKey] = nestedOverrides as IColors[keyof IColors];
    }
  }

  return Object.keys(overrides).length > 0 ? overrides : null;
};
