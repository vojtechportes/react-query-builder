import { DenormalizedQuery } from '../../../shared/query/model/types/query-tree';
import { ITextModeDiagnostic } from './text-mode-diagnostic';

export interface IBuilderTextModeParseResult {
  data?: DenormalizedQuery;
  diagnostics: ITextModeDiagnostic[];
}
