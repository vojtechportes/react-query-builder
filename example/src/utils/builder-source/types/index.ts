import type { IColors } from '../../../../src/constants/colors';

export type CustomizationMode = 'default' | 'mui' | 'antd';

export interface IBuilderSourceOptions {
  readOnly: boolean;
  lockable: boolean;
  cloneable: boolean;
  draggable: boolean;
  history: boolean;
  singleRootGroup: boolean;
  showValidation: boolean;
  customizationMode: CustomizationMode;
  themeColors: IColors;
  defaultThemeColors: IColors;
}
