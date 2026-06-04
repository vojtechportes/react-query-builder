import {
  BuilderFieldOption,
  BuilderFieldOptionsStatus,
  IBuilderFieldOptionState,
} from '../types/field-option';

export interface IBuilderFieldOptionsStore {
  subscribeField: (field: string, listener: () => void) => () => void;
  getFieldState: (field: string) => IBuilderFieldOptionState | undefined;
  setFieldOptions: (
    field: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setFieldStatus: (field: string, status: BuilderFieldOptionsStatus) => void;
  invalidateField: (field: string) => void;
  clearField: (field: string) => void;
  subscribeRule: (ruleId: string, listener: () => void) => () => void;
  getRuleState: (ruleId: string) => IBuilderFieldOptionState | undefined;
  setRuleOptions: (
    ruleId: string,
    options:
      | BuilderFieldOption[]
      | ((current: BuilderFieldOption[]) => BuilderFieldOption[])
  ) => void;
  setRuleStatus: (ruleId: string, status: BuilderFieldOptionsStatus) => void;
  invalidateRule: (ruleId: string) => void;
  clearRule: (ruleId: string) => void;
}
