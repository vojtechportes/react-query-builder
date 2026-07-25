import { useContext, useMemo } from 'react';
import { IColors } from '../../constants/colors';
import { IThemeProps, ThemeContext } from '../theme-provider';
import { mergeThemeColors } from '../utils/merge-theme-colors.util';

export const useTheme = (): Required<IThemeProps> => {
  const themeContext = useContext(ThemeContext);
  const resolvedColors = useMemo<IColors>(
    () => mergeThemeColors(themeContext.colors),
    [themeContext.colors]
  );

  return {
    colors: resolvedColors,
  };
};
