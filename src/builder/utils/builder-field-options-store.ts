import {
  BuilderFieldOption,
  BuilderFieldOptionsStatus,
  IBuilderFieldOptionState,
} from '../types/field-option';

export interface IBuilderFieldOptionsStore {
  subscribe: (field: string, listener: () => void) => () => void;
  getState: (field: string) => IBuilderFieldOptionState | undefined;
  setOptions: (
    field: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setStatus: (field: string, status: BuilderFieldOptionsStatus) => void;
  invalidate: (field: string) => void;
  clear: (field: string) => void;
}
