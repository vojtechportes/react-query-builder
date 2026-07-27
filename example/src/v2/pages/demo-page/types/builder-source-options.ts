import type { IBuilderStyle } from '@vojtechportes/react-query-builder';
import type { LocaleId } from './locale-id';
import type { CustomizationMode } from './customization-mode';

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
  themeStyle: IBuilderStyle;
  defaultThemeStyle: IBuilderStyle;
}
