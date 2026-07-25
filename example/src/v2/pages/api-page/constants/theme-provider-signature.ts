export const themeProviderSignature = `export type ThemeColorOverrides = {
  [Key in keyof IColors]?: IColors[Key] extends string
    ? IColors[Key]
    : Partial<IColors[Key]>;
};

export interface IThemeProps<
  TColors extends ThemeColorOverrides = IColors,
> {
  colors?: TColors;
}

/** @deprecated Prefer public --query-builder-* CSS variables. */
export interface IThemeProviderProps
  extends IThemeProps<ThemeColorOverrides> {
  children?: React.ReactNode;
}

/** @deprecated Prefer public --query-builder-* CSS variables. */
export const ThemeProvider: React.FC<IThemeProviderProps>;`;
