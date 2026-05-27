import { IBuilderFieldProps } from '../../types';
import { DenormalizedQuery } from '../../../utils/query-tree';
import { formatBuilderSqlState } from './format-builder-sql-state';

export const formatBuilderSqlText = (
  data: DenormalizedQuery,
  fields: IBuilderFieldProps[]
): string => formatBuilderSqlState(data, fields).value;
