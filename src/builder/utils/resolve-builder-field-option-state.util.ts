import { isOptionList } from '../../utils/is-option-list.util';
import { IBuilderFieldProps } from '../types';
import { IBuilderFieldOptionState } from '../types/field-option';

export const resolveBuilderFieldOptionState = (
  field: IBuilderFieldProps | undefined,
  fieldState: IBuilderFieldOptionState | undefined,
  ruleState?: IBuilderFieldOptionState | undefined
): IBuilderFieldOptionState => {
  const fallbackOptions =
    field &&
    (field.type === 'LIST' || field.type === 'MULTI_LIST') &&
    isOptionList(field.value)
      ? field.value
      : [];
  const preferredState = ruleState || fieldState;

  return {
    options: preferredState?.options || fallbackOptions,
    status: preferredState?.status || 'idle',
  };
};
