import type { IBuilderStyle } from '@vojtechportes/react-query-builder';

export interface IThemeVariableControl {
  label: string;
  name: keyof IBuilderStyle;
  type: 'color' | 'text';
}
