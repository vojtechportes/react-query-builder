import type { IColors } from '../../constants/colors';

export type ThemeColorOverrides = {
  [Key in keyof IColors]?: IColors[Key] extends string
    ? IColors[Key]
    : Partial<IColors[Key]>;
};
