import type { IParseQueryResult } from '../../types';
import { ISqlDiagnostic } from './sql-diagnostic';
import { ParsedNode } from '../sql-token.types';

export interface ISqlParseResult extends Partial<IParseQueryResult> {
  diagnostics: ISqlDiagnostic[];
  parsedNodes?: ParsedNode[];
}
