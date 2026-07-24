export const themeProviderSignature = `export interface IThemeProps {
  colors?: IColors;
}

export interface IThemeProviderProps extends IThemeProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps>;`;
