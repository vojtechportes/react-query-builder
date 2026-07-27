import type { IThemeVariableControl } from './theme-variable-control';

export interface IThemeVariableGroup {
  label: string;
  controls: IThemeVariableControl[];
}
