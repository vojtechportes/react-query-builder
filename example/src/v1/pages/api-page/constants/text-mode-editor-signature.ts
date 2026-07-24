export const textModeEditorSignature = `export interface ITextModeEditorProps {
  value: string;
  diagnostics: ITextModeDiagnostic[];
  protectedRanges?: ITextModeProtectedRange[];
  protectedRangesMessage?: string | null;
  protectedRangeHoverMessage?: string | null;
  errorMessage: string | null;
  readOnly?: boolean;
  onChange: (value: string) => void;
}

export interface ITextModeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  spellCheck?: boolean;
  inputDataTest?: string;
}`;
