import { useContext, useMemo } from 'react';
import { IThemeProps, ThemeContext } from '../theme-provider'
import { colors, IColors } from '../../constants/colors';

export const useTheme = (): Required<IThemeProps> => {
  const themeContext = useContext(ThemeContext);
  
  const resolvedColors = useMemo<IColors>(() => ({
    ...colors,
    ...themeContext?.colors,
  }), [themeContext?.colors])

  return {
    colors: resolvedColors
  }
}
