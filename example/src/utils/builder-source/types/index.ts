import type { LocaleId } from '../../../constants/locale-options';
import type { IColors } from '@vojtechportes/react-query-builder';

export type CustomizationMode =
  | 'default'
  | 'mui'
  | 'antd'
  | 'mantine'
  | 'fluentui'
  | 'radix'
  | 'bootstrap';

export interface IBuilderSourceOptions {
  readOnly: boolean;
  readOnlyProtectsDelete: boolean;
  lockable: boolean;
  cloneable: boolean;
  draggable: boolean;
  allowGroupNegation: boolean;
  allowFieldComparisons: boolean;
  newNodePlacement: 'append' | 'prepend';
  locale: LocaleId;
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
