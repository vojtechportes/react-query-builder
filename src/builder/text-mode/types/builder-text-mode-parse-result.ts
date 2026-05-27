import { DenormalizedQuery } from '../../../utils/query-tree';
import { ITextModeDiagnostic } from './text-mode-diagnostic';

export interface IBuilderTextModeParseResult {
  data?: DenormalizedQuery;
  diagnostics: ITextModeDiagnostic[];
}
