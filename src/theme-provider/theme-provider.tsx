import React, { FC, createContext, useMemo } from 'react';
import type { IColors } from '../constants/colors';
import type { ThemeColorOverrides } from './types/theme-color-overrides';

export interface IThemeProps<TColors extends ThemeColorOverrides = IColors> {
  colors?: TColors;
}

/**
 * @deprecated ThemeProvider color theming is a legacy compatibility API. Prefer
 * the public `--query-builder-*` CSS variables for new integrations.
 */
export interface IThemeProviderProps extends IThemeProps<ThemeColorOverrides> {
  children?: React.ReactNode;
}

export const ThemeContext = createContext<IThemeProps<ThemeColorOverrides>>({});

/**
 * @deprecated ThemeProvider color theming is a legacy compatibility API. Prefer
 * the public `--query-builder-*` CSS variables for new integrations.
 */
export const ThemeProvider: FC<IThemeProviderProps> = ({
  colors,
  children,
}) => {
  const value = useMemo<IThemeProps<ThemeColorOverrides>>(
    () => ({ colors }),
    [colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
