import { useContext, useMemo } from 'react';
import { IThemeProps, ThemeContext } from '../theme-provider'
import { IColors } from '../../constants/colors';
import { mergeThemeColors } from '../utils/merge-theme-colors';

export const useTheme = (): Required<IThemeProps> => {
  const themeContext = useContext(ThemeContext);
  
  const resolvedColors = useMemo<IColors>(
    () => mergeThemeColors(themeContext?.colors),
    [themeContext?.colors]
  );

  return {
    colors: resolvedColors
  }
}
