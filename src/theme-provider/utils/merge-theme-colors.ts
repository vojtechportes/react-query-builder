import { colors, IColors } from '../../constants/colors';

export const mergeThemeColors = (nextColors?: IColors): IColors => ({
  ...colors,
  ...nextColors,
  primary: {
    ...colors.primary,
    ...nextColors?.primary,
  },
  secondary: {
    ...colors.secondary,
    ...nextColors?.secondary,
  },
  grey: {
    ...colors.grey,
    ...nextColors?.grey,
  },
  info: {
    ...colors.info,
    ...nextColors?.info,
  },
  success: {
    ...colors.success,
    ...nextColors?.success,
  },
  warning: {
    ...colors.warning,
    ...nextColors?.warning,
  },
  error: {
    ...colors.error,
    ...nextColors?.error,
  },
  white: nextColors?.white ?? colors.white,
});
