import { isOptionList } from '../../utils/is-option-list.util';
import { IBuilderFieldProps } from '../types';
import { IBuilderFieldOptionState } from '../types/field-option';

export const resolveBuilderFieldOptionState = (
  field: IBuilderFieldProps | undefined,
  state: IBuilderFieldOptionState | undefined
): IBuilderFieldOptionState => {
  const fallbackOptions =
    field &&
    (field.type === 'LIST' || field.type === 'MULTI_LIST') &&
    isOptionList(field.value)
      ? field.value
      : [];

  return {
    options: state?.options || fallbackOptions,
    status: state?.status || 'idle',
  };
};
