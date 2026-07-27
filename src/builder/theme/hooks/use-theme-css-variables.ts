import { useContext, useMemo } from 'react';
import { ThemeContext } from '../components/theme-provider/theme-provider';
import { createThemeCssVariables } from '../utils/create-theme-css-variables.util';

export const useThemeCssVariables = () => {
  const theme = useContext(ThemeContext);

  return useMemo(() => createThemeCssVariables(theme), [theme]);
};
