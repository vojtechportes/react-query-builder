export type BuilderFieldOption = {
  value: string;
  label: string;
};

export type BuilderFieldOptionsStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export interface IBuilderFieldOptionState {
  options: BuilderFieldOption[];
  status: BuilderFieldOptionsStatus;
}
