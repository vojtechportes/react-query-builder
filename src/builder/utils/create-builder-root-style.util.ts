import type { IBuilderStyle } from '../types/builder-style';

export const createBuilderRootStyle = (
  themeStyle: IBuilderStyle,
  style?: IBuilderStyle
): IBuilderStyle => ({
  ...themeStyle,
  ...style,
});
