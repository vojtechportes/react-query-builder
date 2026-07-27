import { IBuilderFieldOptionState } from '../../../types/field-option';

export const areBuilderFieldOptionStatesEqual = (
  previousState: IBuilderFieldOptionState,
  nextState: IBuilderFieldOptionState
): boolean =>
  previousState.status === nextState.status &&
  JSON.stringify(previousState.options) === JSON.stringify(nextState.options);
