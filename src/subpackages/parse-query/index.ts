import { parsers } from '../../shared/query-formats/registry';
import type {
  IParseQueryResult,
  QueryFormat,
} from '../../shared/query-formats/types';

export type { IParseQueryResult } from '../../shared/query-formats/types';

export const parseQuery = (
  value: string,
  format: QueryFormat
): IParseQueryResult => parsers[format](value);
