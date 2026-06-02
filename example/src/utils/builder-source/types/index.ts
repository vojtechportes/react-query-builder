import type { IColors } from '../../../../src/constants/colors';

export type CustomizationMode =
  | 'default'
  | 'mui'
  | 'antd'
  | 'mantine'
  | 'fluentui'
  | 'bootstrap';

export interface IBuilderSourceOptions {
  readOnly: boolean;
  readOnlyProtectsDelete: boolean;
  lockable: boolean;
  cloneable: boolean;
  draggable: boolean;
  newNodePlacement: 'append' | 'prepend';
  history: boolean;
  textMode: boolean;
  defaultMode: 'builder' | 'text';
  useMonacoTextEditor: boolean;
  singleRootGroup: boolean;
  showValidation: boolean;
  customizationMode: CustomizationMode;
  themeColors: IColors;
  defaultThemeColors: IColors;
}
