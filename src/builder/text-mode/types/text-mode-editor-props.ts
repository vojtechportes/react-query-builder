import { ITextModeDiagnostic } from './text-mode-diagnostic';
import { ITextModeProtectedRange } from './text-mode-protected-range';

export interface ITextModeEditorProps {
  value: string;
  diagnostics: ITextModeDiagnostic[];
  protectedRanges?: ITextModeProtectedRange[];
  protectedRangesMessage?: string | null;
  protectedRangeHoverMessage?: string | null;
  errorMessage: string | null;
  readOnly?: boolean;
  onChange: (value: string) => void;
}
