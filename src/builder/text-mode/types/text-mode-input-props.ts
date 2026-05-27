export interface ITextModeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  spellCheck?: boolean;
  inputDataTest?: string;
}
