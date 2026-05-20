import { parsers } from '../query-formats/registry';
import type { IParseQueryResult, QueryFormat } from '../query-formats/types';

export type { IParseQueryResult } from '../query-formats/types';

export const parseQuery = (
  value: string,
  format: QueryFormat
): IParseQueryResult => parsers[format](value);

