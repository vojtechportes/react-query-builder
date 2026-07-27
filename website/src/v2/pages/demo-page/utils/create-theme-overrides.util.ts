import type { IBuilderStyle } from '@vojtechportes/react-query-builder';

export const createThemeOverrides = (
  themeStyle: IBuilderStyle,
  defaultThemeStyle: IBuilderStyle
): IBuilderStyle | undefined => {
  const overrides = Object.fromEntries(
    Object.entries(themeStyle).filter(
      ([name, value]) =>
        value !== defaultThemeStyle[name as keyof IBuilderStyle]
    )
  ) as IBuilderStyle;

  return Object.keys(overrides).length > 0 ? overrides : undefined;
};
