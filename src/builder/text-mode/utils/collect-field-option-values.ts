import { IBuilderFieldProps } from '../../types';

export const collectFieldOptionValues = (
  field: IBuilderFieldProps
): Array<string | number> => {
  if (field.type !== 'LIST' && field.type !== 'MULTI_LIST') {
    return [];
  }

  return (field.value || []).map((option) => option.value);
};
