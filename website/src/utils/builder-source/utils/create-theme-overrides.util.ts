import type { IColors } from '@vojtechportes/react-query-builder';

export const createThemeOverrides = (
  themeColors: IColors,
  defaultThemeColors: IColors
): Partial<IColors> | null => {
  const overrides: Partial<IColors> = {};
  const overrideRecord = overrides as Record<
    keyof IColors,
    IColors[keyof IColors] | undefined
  >;

  for (const colorGroupKey of Object.keys(themeColors) as Array<
    keyof IColors
  >) {
    const nextValue = themeColors[colorGroupKey];
    const defaultValue = defaultThemeColors[colorGroupKey];

    if (typeof nextValue === 'string' || typeof defaultValue === 'string') {
      if (nextValue !== defaultValue) {
        overrideRecord[colorGroupKey] = nextValue as IColors[keyof IColors];
      }

      continue;
    }

    const nextValueRecord = nextValue as unknown as Record<string, string>;
    const defaultValueRecord = defaultValue as unknown as Record<
      string,
      string
    >;
    const nestedOverrides = Object.fromEntries(
      Object.entries(nextValueRecord).filter(
        ([key, value]) => value !== defaultValueRecord[key]
      )
    );

    if (Object.keys(nestedOverrides).length > 0) {
      overrideRecord[colorGroupKey] =
        nestedOverrides as unknown as IColors[keyof IColors];
    }
  }

  return Object.keys(overrides).length > 0 ? overrides : null;
};
