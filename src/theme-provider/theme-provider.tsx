import { IColors } from '../constants/colors';
import React, { FC, createContext, useMemo } from 'react';

export interface IThemeProps {
  colors?: IColors;
}

export interface IThemeProviderProps extends IThemeProps {
  children?: React.ReactNode;
}

export const ThemeContext = createContext<IThemeProps>(
  {} as IThemeProps
);

export const ThemeProvider: FC<IThemeProviderProps> = ({
  colors,
  children,
}) => {
  const value = useMemo<IThemeProps>(
    () => ({
      colors,
    }),
    [colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
